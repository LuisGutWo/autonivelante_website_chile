"use client";
import Link from "next/link";
import React from "react";

export default function CartProductEmpty(): React.ReactElement {
  return (
     <tr role="row" aria-live="polite">
       <td colSpan={7} className="prod-column" role="cell">
        <div className="column-box">
           <Link href="/products" aria-label="Ir a la página de productos">
            {/* Sin `text-light`: esa clase de Bootstrap pinta #f8f9fa, y aqui el fondo
                es blanco. El resultado era un mensaje invisible, justo en el estado
                donde la persona mas necesita que le digan que hacer. `theme-btn-two`
                ya trae color oscuro y borde: se ve como la pildora que el diseño
                pedia. */}
            <h2 className="theme-btn-two product__empty-section mb-0 text-center">
              Tu carrito está vacío, revisa nuestros productos
            </h2>
          </Link>
        </div>
      </td>
    </tr>
  );
}
