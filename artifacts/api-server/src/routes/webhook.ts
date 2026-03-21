import { Router, raw } from "express";
import { getUncachableStripeClient } from "../lib/stripe";

const router = Router();

const proUsers = new Map<string, { email: string; upgradedAt: Date; sessionId: string }>();

export function getProUsers() {
  return proUsers;
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
      } else {
        event = JSON.parse(
          typeof req.body === "string" ? req.body : req.body.toString()
        );
        console.log("[stripe-webhook] ⚠️  No signature verification (dev mode)");
      }
    } catch (err: any) {
      console.error("[stripe-webhook] ❌ Signature verification failed:", err.message);
      res.status(400).json({ error: "Webhook signature verification failed" });
      return;
    }

    console.log(`[stripe-webhook] 📩 Received event: ${event.type} (${event.id})`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const email = session.customer_details?.email ?? session.customer_email ?? "unknown";
      const sessionId = session.id;

      proUsers.set(email, {
        email,
        upgradedAt: new Date(),
        sessionId,
      });

      console.log(`[stripe-webhook] ✅ User upgraded to PRO:`);
      console.log(`  Email:      ${email}`);
      console.log(`  Session ID: ${sessionId}`);
      console.log(`  Time:       ${new Date().toISOString()}`);
      console.log(`[stripe-webhook] 📊 Total PRO users: ${proUsers.size}`);
    }

    res.json({ received: true });
  }
);

export default router;
