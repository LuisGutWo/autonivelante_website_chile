import Stripe from "stripe";

export const dynamic = "force-dynamic";

let stripe = null;
function getStripe() {
  if (!stripe) {
    const secret = process.env.NEXT_STRIPE_SECRET_KEY;
    if (!secret) {
      throw new Error("Missing NEXT_STRIPE_SECRET_KEY environment variable");
    }
    stripe = new Stripe(secret, {
      apiVersion: "2024-11-20",
    });
  }
  return stripe;
}

export async function GET(request) {
  const stripe = getStripe();
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get("paymentIntentId");

    if (!paymentIntentId) {
      return new Response(
        JSON.stringify({ error: "Payment intent ID not provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Check payment status
    if (paymentIntent.status === "succeeded") {
      return new Response(
        JSON.stringify({
          status: "success",
          message: "Pago completado exitosamente",
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    } else if (paymentIntent.status === "processing") {
      return new Response(
        JSON.stringify({
          status: "processing",
          message: "Pago en procesamiento",
          paymentIntentId: paymentIntent.id,
        }),
        { status: 202, headers: { "Content-Type": "application/json" } },
      );
    } else {
      return new Response(
        JSON.stringify({
          status: "failed",
          message: "Pago fallido",
          paymentIntentId: paymentIntent.id,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Error verificando pago",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
