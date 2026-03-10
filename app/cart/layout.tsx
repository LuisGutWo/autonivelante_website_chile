import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Carrito",
  description:
    "Revisa los productos seleccionados en tu carrito y prepara tu compra en Autonivelante Chile.",
  alternates: {
    canonical: "/cart",
  },
};

export default function CartLayout({ children }: { children: ReactNode }) {
  return children;
}
