"use client";

import { loadStripe } from "@stripe/js";
import { Elements } from "@stripe/react-stripe-js";
import { useMemo } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

export function StripeProvider({ children }) {
  const options = useMemo(
    () => ({
      mode: "payment",
      currency: "usd",
      appearance: {
        theme: "stripe",
        variables: {
          colorPrimary: "#0066cc",
          colorText: "#30313d",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          spacingUnit: "4px",
          borderRadius: "4px",
        },
        rules: {
          ".Label": {
            marginBottom: "8px",
          },
          ".Input": {
            padding: "12px",
            borderColor: "#e0e0e0",
          },
          ".Input:focus": {
            borderColor: "#0066cc",
          },
        },
      },
    }),
    [],
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
