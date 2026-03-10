"use client";
import Link from "next/link";
import React from "react";

export default function CartProductEmpty(): React.ReactElement {
  return (
     <tr role="row" aria-live="polite">
       <td colSpan={7} className="prod-column" role="cell">
        <div className="column-box">
           <Link href="/products" aria-label="Ir a la página de productos">
            <h2 className="theme-btn-two text-light product__empty-section mb-0 text-center">
              Tu carrito está vacío, revisa nuestros productos
            </h2>
          </Link>
        </div>
      </td>
    </tr>
  );
}
