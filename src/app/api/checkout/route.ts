import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe, PLANS, PlanType } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { plan } = body as { plan: PlanType };

    if (!plan || !PLANS[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const selectedPlan = PLANS[plan];

    if (selectedPlan.priceInCents === 0) {
      return NextResponse.json({ error: "Free plan does not require checkout" }, { status: 400 });
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Macrotrue ${selectedPlan.name} Plan`,
              description: `Monthly subscription to ${selectedPlan.name} plan`,
            },
            unit_amount: selectedPlan.priceInCents,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        clerkId: userId,
        plan: plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
