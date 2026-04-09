import { Router, type Request, type Response } from "express";
import { getUncachableStripeClient, getStripePublishableKey } from "../lib/stripe";

const router = Router();

const PLANS = {
  early: {
    price: 900,
    name: "EdgeIQ Early Access",
    description: "Full access to real-time signals, AI predictions, and instant alerts.",
  },
  pro: {
    price: 1900,
    name: "EdgeIQ Pro",
    description: "Real-time signals, AI predictions, and instant alerts.",
  },
  elite: {
    price: 4900,
    name: "EdgeIQ Elite",
    description: "Everything in Pro plus priority signals, dark pool data, and dedicated support.",
  },
};

function getBaseUrl(): string {
  if (process.env.REPLIT_DEPLOYMENT === "1" && process.env.REPLIT_DOMAINS) {
    const primaryDomain = process.env.REPLIT_DOMAINS.split(",")[0];
    return `https://${primaryDomain}`;
  }
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  return process.env.APP_URL || "http://localhost";
}

router.get("/checkout/config", async (_req, res) => {
  try {
    const publishableKey = await getStripePublishableKey();
    res.json({ publishableKey });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Failed to get config" });
  }
});

router.post("/checkout/create-session", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const stripe = await getUncachableStripeClient();

    const planParam = req.body?.plan;
    if (planParam !== "early" && planParam !== "pro" && planParam !== "elite") {
      res.status(400).json({ error: 'Invalid plan. Must be "early", "pro", or "elite".' });
      return;
    }
    const plan: "early" | "pro" | "elite" = planParam;
    const planConfig = PLANS[plan];

    const baseUrl = getBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: req.user!.email ?? undefined,
      metadata: { plan, userId: req.user!.id },
      subscription_data: {
        metadata: { plan, userId: req.user!.id },
      },
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: planConfig.price,
            recurring: { interval: "month" },
            product_data: {
              name: planConfig.name,
              description: planConfig.description,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Checkout failed" });
  }
});

export default router;
