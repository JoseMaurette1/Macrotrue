import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  typescript: true,
});

export type PlanType = "starter" | "premium" | "pro";

export const PLANS: Record<
  Exclude<PlanType, "starter">,
  { name: string; priceInCents: number }
> = {
  premium: {
    name: "Premium",
    priceInCents: 300,
  },
  pro: {
    name: "Pro",
    priceInCents: 1000,
  },
};
