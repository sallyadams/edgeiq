import { Router, raw } from "express";
import { getUncachableStripeClient } from "../lib/stripe";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

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
      } else {
        event = JSON.parse(
          typeof req.body === "string" ? req.body : req.body.toString()
        );
        console.log("[stripe-webhook] ⚠️  No signature verification (dev mode)");
      }
    } catch (err) {
      console.error("[stripe-webhook] ❌ Signature verification failed:", err instanceof Error ? err.message : err);
      res.status(400).json({ error: "Webhook signature verification failed" });
      return;
    }

    console.log(`[stripe-webhook] 📩 Received event: ${event.type} (${event.id})`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.userId ?? null;
      const email = session.customer_details?.email ?? session.customer_email ?? null;
      const sessionId = session.id;
      const plan = session.metadata?.plan ?? "pro";
      const tier = plan === "elite" ? "elite" : "pro";

      try {
        let updated;
        if (userId) {
          [updated] = await db
            .update(usersTable)
            .set({ tier, updatedAt: new Date() })
            .where(eq(usersTable.id, userId))
            .returning();
        } else if (email) {
          [updated] = await db
            .update(usersTable)
            .set({ tier, updatedAt: new Date() })
            .where(eq(usersTable.email, email))
            .returning();
        }

        if (updated) {
          console.log(`[stripe-webhook] ✅ User upgraded to ${tier.toUpperCase()}:`);
          console.log(`  User ID:    ${updated.id}`);
          console.log(`  Email:      ${updated.email}`);
          console.log(`  Plan:       ${plan}`);
          console.log(`  Session ID: ${sessionId}`);
          console.log(`  Time:       ${new Date().toISOString()}`);
        } else {
          console.log(`[stripe-webhook] ⚠️  No user found for userId=${userId} email=${email}`);
        }
      } catch (err) {
        console.error("[stripe-webhook] ❌ Failed to update user tier:", err);
      }
    }

    res.json({ received: true });
  }
);

export default router;
