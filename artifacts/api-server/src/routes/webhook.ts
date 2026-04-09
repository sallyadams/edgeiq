import { Router, raw } from "express";
import { getUncachableStripeClient } from "../lib/stripe";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const isProduction = process.env.REPLIT_DEPLOYMENT === "1";

async function upgradeUser(userId: string | null, email: string | null, plan: string, extra: Record<string, string | null> = {}) {
  const tier = plan === "elite" ? "elite" : plan === "early" ? "pro" : "pro";
  const updateData: Record<string, unknown> = { tier, updatedAt: new Date() };

  if (extra.stripeCustomerId) updateData.stripeCustomerId = extra.stripeCustomerId;
  if (extra.stripeSubscriptionId) updateData.stripeSubscriptionId = extra.stripeSubscriptionId;

  let updated;
  if (userId) {
    [updated] = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, userId))
      .returning();
  } else if (email) {
    [updated] = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.email, email))
      .returning();
  }

  return updated;
}

router.post(
  "/webhook/stripe",
  raw({ type: "application/json" }),
  async (req, res) => {
    const stripe = await getUncachableStripeClient();
    const sig = req.headers["stripe-signature"] as string | undefined;

    let event;
    try {
      if (sig && process.env.STRIPE_WEBHOOK_SECRET) {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } else if (isProduction) {
        console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is required in production");
        res.status(400).json({ error: "Webhook signature verification required in production" });
        return;
      } else {
        event = JSON.parse(
          typeof req.body === "string" ? req.body : req.body.toString()
        );
        console.log("[stripe-webhook] No signature verification (dev mode)");
      }
    } catch (err) {
      console.error("[stripe-webhook] Signature verification failed:", err instanceof Error ? err.message : err);
      res.status(400).json({ error: "Webhook signature verification failed" });
      return;
    }

    console.log(`[stripe-webhook] Received event: ${event.type} (${event.id})`);

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          const userId = session.metadata?.userId ?? null;
          const email = session.customer_details?.email ?? session.customer_email ?? null;
          const plan = session.metadata?.plan ?? "pro";
          const stripeCustomerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
          const stripeSubscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;

          const updated = await upgradeUser(userId, email, plan, { stripeCustomerId, stripeSubscriptionId });

          if (updated) {
            console.log(`[stripe-webhook] User upgraded to ${plan.toUpperCase()}:`);
            console.log(`  User ID:       ${updated.id}`);
            console.log(`  Email:         ${updated.email}`);
            console.log(`  Plan:          ${plan}`);
            console.log(`  Customer ID:   ${stripeCustomerId}`);
            console.log(`  Subscription:  ${stripeSubscriptionId}`);
            console.log(`  Session ID:    ${session.id}`);
          } else {
            console.log(`[stripe-webhook] No user found for userId=${userId} email=${email}`);
          }
          break;
        }

        case "invoice.payment_succeeded": {
          const invoice = event.data.object;
          const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id ?? null;
          const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id ?? null;

          if (customerId) {
            const [user] = await db
              .select()
              .from(usersTable)
              .where(eq(usersTable.stripeCustomerId, customerId))
              .limit(1);

            if (user) {
              console.log(`[stripe-webhook] Invoice paid for user ${user.id} (${user.email}), subscription ${subscriptionId}`);
              await db
                .update(usersTable)
                .set({ updatedAt: new Date() })
                .where(eq(usersTable.id, user.id));
            } else {
              console.log(`[stripe-webhook] Invoice paid but no user found for customer ${customerId}`);
            }
          }
          break;
        }

        case "customer.subscription.created": {
          const subscription = event.data.object;
          const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id ?? null;
          const subscriptionId = subscription.id;

          if (customerId) {
            const [user] = await db
              .select()
              .from(usersTable)
              .where(eq(usersTable.stripeCustomerId, customerId))
              .limit(1);

            if (user) {
              console.log(`[stripe-webhook] Subscription created for user ${user.id}: ${subscriptionId}`);
              await db
                .update(usersTable)
                .set({ stripeSubscriptionId: subscriptionId, updatedAt: new Date() })
                .where(eq(usersTable.id, user.id));
            } else {
              console.log(`[stripe-webhook] Subscription created but no user found for customer ${customerId}`);
            }
          }
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id ?? null;

          if (customerId) {
            const [user] = await db
              .select()
              .from(usersTable)
              .where(eq(usersTable.stripeCustomerId, customerId))
              .limit(1);

            if (user) {
              console.log(`[stripe-webhook] Subscription cancelled for user ${user.id} — downgrading to free`);
              await db
                .update(usersTable)
                .set({ tier: "free", stripeSubscriptionId: null, updatedAt: new Date() })
                .where(eq(usersTable.id, user.id));
            }
          }
          break;
        }

        default:
          console.log(`[stripe-webhook] Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      console.error(`[stripe-webhook] Error handling ${event.type}:`, err);
    }

    res.json({ received: true });
  }
);

export default router;
