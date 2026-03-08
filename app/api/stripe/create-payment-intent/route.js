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

export async function POST(request) {
  const stripe = getStripe();
  try {
    const { amount, orderId } = await request.json();

    // Validar datos
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({
          error: "Monto inválido",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Crear PaymentIntent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir a centavos
      currency: "usd",
      metadata: {
        orderId: orderId || "unknown",
      },
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return new Response(
      JSON.stringify({
        error: "Error al crear intent de pago",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
