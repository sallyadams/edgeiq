import { Router } from "express";
import { getUncachableStripeClient, getStripePublishableKey } from "../lib/stripe";

const router = Router();

const PRO_PRICE_EUR_CENTS = 1900;
const PRODUCT_NAME = "EdgeIQ Pro";

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

    const origin = req.headers.origin || req.headers.referer || "http://localhost";
    const baseUrl = new URL(origin).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: PRO_PRICE_EUR_CENTS,
            recurring: { interval: "month" },
            product_data: {
              name: PRODUCT_NAME,
              description: "Real-time signals, AI predictions, and instant alerts.",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/signals?upgraded=true`,
      cancel_url: `${baseUrl}/signals`,
    });

    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
