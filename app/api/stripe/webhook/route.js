import Stripe from "stripe";

export const dynamic = "force-dynamic";
import { updateOrderStatus } from "../../../../src/lib/api";

const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20",
});

const endpointSecret = process.env.NEXT_STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log("PaymentIntent was successful!");

        // Update order status
        if (paymentIntent.metadata?.orderId) {
          await updateOrderStatus(paymentIntent.metadata.orderId, "completed");
        }
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        console.log("Payment failed:", failedPayment);

        if (failedPayment.metadata?.orderId) {
          await updateOrderStatus(failedPayment.metadata.orderId, "failed");
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
