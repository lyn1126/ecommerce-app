import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = new Stripe(secretKey ?? "", {
  apiVersion: "2025-03-31.basil",
});

export function isStripeConfigured() {
  return Boolean(secretKey);
}
