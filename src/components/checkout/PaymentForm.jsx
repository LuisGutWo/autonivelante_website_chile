"use client";

import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import styles from "./PaymentForm.module.css";

export function PaymentForm({
  onPaymentSuccess,
  orderId,
  amount,
  isProcessing = false,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe no está cargado. Por favor, intenta nuevamente.");
      return;
    }

    setProcessing(true);

    try {
      // Crear Payment Intent en el servidor
      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // convertir a centavos
          orderId,
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear la intención de pago");
      }

      const { clientSecret } = await response.json();

      // Confirmar el pago
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        onPaymentSuccess(result.paymentIntent.id);
      }
    } catch (err) {
      setError(err.message || "Error al procesar el pago");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className={styles.paymentForm}>
      <div className={styles.formGroup}>
        <label htmlFor="card">Tarjeta de Crédito/Débito</label>
        <div className={styles.cardElement}>
          <CardElement
            id="card"
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#30313d",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#fa755a",
                },
              },
            }}
          />
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button
        type="submit"
        disabled={!stripe || processing || isProcessing}
        className={styles.submitButton}
      >
        {processing || isProcessing
          ? "Procesando pago..."
          : `Pagar $${amount.toLocaleString("es-CL")}`}
      </button>

      <p className={styles.disclaimer}>
        Tu pago es seguro. Utilizamos encriptación SSL y Stripe para proteger tu
        información.
      </p>
    </form>
  );
}
