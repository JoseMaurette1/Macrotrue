import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkId = session.metadata?.clerkId;
        const plan = session.metadata?.plan;

        if (!clerkId || !plan) {
          console.error("Missing metadata in checkout session");
          break;
        }

        const subscriptionId = session.subscription as string;
        const stripeSubscriptionRaw = await stripe.subscriptions.retrieve(subscriptionId);
        const stripeSubscription = stripeSubscriptionRaw as unknown as {
          items: { data: Array<{ price: { id: string } }> };
          current_period_start: number;
          current_period_end: number;
        };

        await db.insert(subscriptions).values({
          clerkId,
          stripeSubscriptionId: subscriptionId,
          stripeCustomerId: session.customer as string,
          stripePriceId: stripeSubscription.items.data[0]?.price.id,
          plan,
          status: "active",
          currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        }).onConflictDoUpdate({
          target: subscriptions.clerkId,
          set: {
            stripeSubscriptionId: subscriptionId,
            stripeCustomerId: session.customer as string,
            stripePriceId: stripeSubscription.items.data[0]?.price.id,
            plan,
            status: "active",
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            updatedAt: new Date(),
          },
        });

        console.log(`Subscription created for user ${clerkId}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscriptionRaw = event.data.object as Stripe.Subscription;
        const subscription = subscriptionRaw as unknown as {
          id: string;
          status: string;
          current_period_start: number;
          current_period_end: number;
          cancel_at_period_end: boolean;
        };
        const existingSubscription = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
          .limit(1);

        if (existingSubscription.length > 0) {
          await db.update(subscriptions)
            .set({
              status: subscription.status === "active" ? "active" : "inactive",
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

          console.log(`Subscription ${subscription.id} updated`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscriptionRaw = event.data.object as Stripe.Subscription;
        const subscription = subscriptionRaw as unknown as { id: string };

        await db.update(subscriptions)
          .set({
            status: "cancelled",
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

        console.log(`Subscription ${subscription.id} cancelled`);
        break;
      }

      case "invoice.payment_failed": {
        const invoiceRaw = event.data.object as Stripe.Invoice;
        const invoice = invoiceRaw as unknown as { subscription: string | null };
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          await db.update(subscriptions)
            .set({
              status: "past_due",
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

          console.log(`Payment failed for subscription ${subscriptionId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
