import { Router } from "express";
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

router.get("/checkout/config", async (_req, res) => {
  try {
    const publishableKey = await getStripePublishableKey();
    res.json({ publishableKey });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/checkout/create-session", async (req, res) => {
  try {
    const stripe = await getUncachableStripeClient();

    const planParam = req.body?.plan;
    if (planParam !== "early" && planParam !== "pro" && planParam !== "elite") {
      res.status(400).json({ error: 'Invalid plan. Must be "early", "pro", or "elite".' });
      return;
    }
    const plan: "early" | "pro" | "elite" = planParam;
    const planConfig = PLANS[plan];

    const referer = req.headers.referer || req.headers.origin || "http://localhost";
    const refererUrl = new URL(referer);
    const baseUrl = refererUrl.origin;
    const pathPrefix = refererUrl.pathname.replace(/\/signals.*$/, "").replace(/\/+$/, "");

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
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
      success_url: `${baseUrl}${pathPrefix}/signals?upgraded=true`,
      cancel_url: `${baseUrl}${pathPrefix}/signals`,
    });

    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
