"use client";
import Link from "next/link";
import React from "react";

export default function CartProductEmpty(): React.ReactElement {
  return (
     <tr role="row" aria-live="polite">
       <td colSpan={4} className="prod-column" role="cell">
        <div className="column-box">
           <Link href="/products" aria-label="Ir a la página de productos">
            <h2 className="btn btn-danger product__empty-section">
              No hay productos en tu carrito
            </h2>
          </Link>
        </div>
      </td>
    </tr>
  );
}
