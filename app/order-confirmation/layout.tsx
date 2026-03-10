import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Confirmacion de Orden",
  description:
    "Detalle y confirmacion de tu pedido en Autonivelante Chile.",
  alternates: {
    canonical: "/order-confirmation",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderConfirmationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
