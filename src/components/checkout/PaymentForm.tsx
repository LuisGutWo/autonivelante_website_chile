"use client";

import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import styles from "./PaymentForm.module.css";

interface PaymentFormProps {
  onPaymentSuccess: (paymentIntentId: string) => void | Promise<void>;
  orderId: string;
  amount: number;
  isProcessing?: boolean;
}

interface CreatePaymentIntentResponse {
  clientSecret: string;
}

export function PaymentForm({
  onPaymentSuccess,
  orderId,
  amount,
  isProcessing = false,
}: PaymentFormProps): ReactElement {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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

      const { clientSecret } =
        (await response.json()) as CreatePaymentIntentResponse;

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError("No se pudo leer la tarjeta. Intenta nuevamente.");
        setProcessing(false);
        return;
      }

      // Confirmar el pago
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setError(result.error.message ?? "Error al procesar el pago");
        setProcessing(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        await onPaymentSuccess(result.paymentIntent.id);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al procesar el pago";
      setError(errorMessage);
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
