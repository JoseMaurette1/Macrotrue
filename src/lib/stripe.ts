import Stripe from "stripe";
import { loadStripe, Stripe as StripeJS } from "@stripe/stripe-js";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-18.acacia" as Stripe.LatestApiVersion,
  typescript: true,
});

let stripePromise: Promise<StripeJS | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
};

export const PLANS = {
  starter: {
    name: "Starter",
    priceInCents: 0,
    priceId: null,
  },
  premium: {
    name: "Premium",
    priceInCents: 300,
    priceId: "price_premium",
  },
  pro: {
    name: "Pro",
    priceInCents: 1000,
    priceId: "price_pro",
  },
} as const;

export type PlanType = keyof typeof PLANS;
