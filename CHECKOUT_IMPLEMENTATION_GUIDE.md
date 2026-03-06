# 🛒 Guía de Implementación - Checkout Completo

**Estado**: ✅ FASE 2 COMPLETADA - Estructura Base Implementada  
**Fecha**: Marzo 2026  
**Versión**: 1.0.0

---

## 📋 ¿Qué se ha Implementado?

### ✅ Completado

- [x] Página de Checkout `/app/checkout/page.jsx`
- [x] Formulario de Compra `CheckoutForm.jsx`
- [x] Resumen de Carrito `CartSummary.jsx`
- [x] Página de Confirmación `/app/order-confirmation/page.jsx`
- [x] API de Órdenes en Firebase
- [x] Acción `clearCart` en Redux
- [x] Validación de Formulario
- [x] Estructura de Órdenes

### 🟡 Próximos Pasos

- [ ] Integración de Stripe (Recomendado)
- [ ] O Integración de Mercado Pago (Alternativa)
- [ ] Configuración EmailJS para confirmaciones
- [ ] Testing E2E del flujo
- [ ] UI/UX refinement

---

## 🔧 CONFIGURACIÓN REQUERIDA

### 1. Variables de Entorno (`.env.local`)

```bash
# ========== CHECKOUT SETTINGS ==========

# EmailJS - Para envío de confirmaciones
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=public_key_xxxxx
NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID=template_order_confirmation

# Stripe (Opción A - RECOMENDADO)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx  # Solo servidor

# O Mercado Pago (Opción B)
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxxxx
MERCADOPAGO_ACCESS_TOKEN=APP_USR_xxxxx  # Solo servidor

# Firebase (Ya existe, necesario para órdenes)
NEXT_DATABASE_URL=https://xxxxx-default-rtdb.firebaseio.com
NEXT_STORAGE_BUCKET=xxxxx.firebasestorage.app
```

---

## 📦 INSTALACIÓN DE DEPENDENCIAS

### Opción A: Con Stripe (RECOMENDADO para Chile)

```bash
npm install @stripe/react-stripe-js @stripe/js
```

### Opción B: Con Mercado Pago

```bash
npm install @mercadopago/sdk-js
```

### EmailJS (Necesario para ambos)

```bash
npm install @emailjs/browser  # Ya instalado
```

---

## 🎯 ESTRUCTURA DE ÓRDENES EN FIREBASE

```
orders/
├── ORD-1704067200000/
│   ├── orderId: "ORD-1704067200000"
│   ├── status: "pending_payment" | "paid" | "shipped" | "delivered" | "cancelled"
│   ├── createdAt: "2024-01-01T12:00:00Z"
│   ├── customerInfo:
│   │   ├── firstName: "Juan"
│   │   ├── lastName: "Pérez"
│   │   ├── email: "juan@example.com"
│   │   └── phone: "+56 9 XXXX XXXX"
│   ├── shippingInfo:
│   │   ├── street: "Av. La Dehesa"
│   │   ├── streetNumber: "1822"
│   │   ├── apartment: "430"
│   │   ├── city: "Santiago"
│   │   ├── region: "Metropolitana"
│   │   └── postalCode: "8320000"
│   ├── items: [
│   │   {
│   │     "id": "prod-123",
│   │     "title": "Producto X",
│   │     "price": 50000,
│   │     "qty": 2,
│   │     "image": "https://..."
│   │   }
│   │ ]
│   ├── summary:
│   │   ├── subtotal: 100000
│   │   ├── shipping: 0
│   │   └── total: 100000
│   └── notes: "Instrucciones especiales..."
```

---

## 💳 INTEGRACIÓN DE PAGO - OPCIÓN A (STRIPE)

### 1. Instalar Dependencias

```bash
npm install @stripe/react-stripe-js @stripe/js
```

### 2. Crear Provider de Stripe

Crear `/app/providers/StripeProvider.jsx`:

```jsx
"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export function StripeProvider({ children }) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}
```

### 3. Envolver la App

En `app/layout.jsx`:

```jsx
import { StripeProvider } from "@/app/providers/StripeProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          <StripeProvider>
            {children}
          </StripeProvider>
        </Providers>
      </body>
    </html>
  );
}
```

### 4. Crear Componente de Pago

Crear `/src/components/checkout/PaymentForm.jsx`:

```jsx
"use client";
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, Card } from "react-bootstrap";
import toast from "react-hot-toast";

export default function PaymentForm({ orderId, amount, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // 1. Crear Payment Intent en tu servidor
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, orderId }),
      });

      const { clientSecret } = await response.json();

      // 2. Confirmar pago
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        onError?.(result.error);
      } else if (result.paymentIntent.status === "succeeded") {
        toast.success("¡Pago exitoso!");
        onSuccess?.(result.paymentIntent);
      }
    } catch (error) {
      toast.error("Error procesando pago");
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h5>Información de Pago</h5>
      </Card.Header>
      <Card.Body>
        <form onSubmit={handleSubmit}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": { color: "#aab7c4" },
                },
                invalid: { color: "#9e2146" },
              },
            }}
          />
          <Button
            type="submit"
            className="theme-btn-one w-100 mt-3"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? "Procesando..." : `Pagar ${amount}`}
          </Button>
        </form>
      </Card.Body>
    </Card>
  );
}
```

### 5. Crear API Route para Payment Intent

Crear `/app/api/create-payment-intent/route.js`:

```javascript
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { amount, orderId } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Centavos
      currency: "clp",
      metadata: { orderId },
    });

    return Response.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
```

---

## 💳 INTEGRACIÓN DE PAGO - OPCIÓN B (MERCADO PAGO)

### 1. Instalar SDK

```bash
npm install @mercadopago/sdk-js
```

### 2. Crear Componente de Pago

Crear `/src/components/checkout/MercadoPagoPayment.jsx`:

```jsx
"use client";
import React, { useState, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import toast from "react-hot-toast";

export default function MercadoPagoPayment({ orderId, amount, customerEmail, onSuccess }) {
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    const createPreference = async () => {
      try {
        const response = await fetch("/api/mercadopago/create-preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            amount,
            customerEmail,
          }),
        });

        const { preferenceId } = await response.json();
        setPreferenceId(preferenceId);
      } catch (error) {
        toast.error("Error creando preferencia de pago");
      }
    };

    createPreference();
  }, [orderId, amount, customerEmail]);

  const handlePayment = () => {
    if (preferenceId) {
      // Redirigir a Mercado Pago
      window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
    }
  };

  return (
    <Card>
      <Card.Header>
        <h5>Información de Pago</h5>
      </Card.Header>
      <Card.Body>
        <p className="text-muted mb-3">
          Serás redirigido a Mercado Pago para completar el pago de forma segura
        </p>
        <Button
          onClick={handlePayment}
          className="theme-btn-one w-100"
          disabled={!preferenceId}
        >
          Pagar con Mercado Pago
        </Button>
      </Card.Body>
    </Card>
  );
}
```

### 3. API Route para Mercado Pago

Crear `/app/api/mercadopago/create-preference/route.js`:

```javascript
export async function POST(request) {
  try {
    const { orderId, amount, customerEmail } = await request.json();

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            id: orderId,
            title: `Orden ${orderId}`,
            unit_price: amount,
            quantity: 1,
            currency_id: "CLP",
          },
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/order-confirmation?orderId=${orderId}`,
          failure: `${process.env.NEXT_PUBLIC_URL}/checkout`,
          pending: `${process.env.NEXT_PUBLIC_URL}/checkout`,
        },
        notification_url: `${process.env.NEXT_PUBLIC_URL}/api/mercadopago/webhook`,
        payer: {
          email: customerEmail,
        },
      }),
    });

    const data = await response.json();
    return Response.json({ preferenceId: data.id });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
```

---

## 📧 CONFIGURACIÓN EMAILJS

### 1. Obtener Credenciales

1. Ve a <https://www.emailjs.com/>
2. Crea una cuenta gratis
3. Crea un Servicio de Email (Gmail, Outlook, etc.)
4. Copia:
   - **Service ID**
   - **Public Key**

### 2. Crear Plantilla de Email

En EmailJS Dashboard:

**Template Name**: `template_order_confirmation`

**HTML Content**:

```html
<h2>¡Gracias por tu compra!</h2>
<p>Hola {{customer_name}},</p>

<p>Tu orden ha sido confirmada. Aquí están los detalles:</p>

<h3>Orden #{{order_id}}</h3>
<p><strong>Fecha:</strong> {{order_date}}</p>

<h3>Productos</h3>
<p>{{order_items}}</p>

<h3>Resumen</h3>
<p><strong>Total:</strong> {{order_total}}</p>

<p>Recibirás otro email cuando tu orden sea despachada.</p>

<p>¡Gracias por confiar en Autonivelante!</p>
```

### 3. Configurar en `.env.local`

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=public_key_xxxxx
NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID=template_order_confirmation
```

---

## 🧪 FLUJO COMPLETO DE TESTING

### 1. Carrito → Checkout

```
/cart → Click "Ir al Checkout" → /checkout
```

### 2. Checkout → Confirmación

```
Llenar formulario → Validación → Guardar orden → /order-confirmation
```

### 3. Email de Confirmación

```
Orden creada → EmailJS envía email → Cliente recibe confirmación
```

### 4. Pago (Cuando se implemente)

```
Cliente hace clic "Pagar" → Stripe/MP → Confirmación → Webhook → Actualizar estado
```

---

## 🔒 CONSIDERACIONES DE SEGURIDAD

### ✅ Lo que está bien

- Validación de formulario en client + server
- Variables de entorno para secrets
- Uso de HTTPS recomendado
- Datos sensibles no logueados

### ⚠️ Pendiente (Implementar después)

- Rate limiting en APIs
- CSRF protection
- Input sanitization
- Age verification para ciertos productos
- PCI DSS compliance (si usas tarjetas directas)

---

## 📊 ESTADÍSTICAS DE IMPLEMENTACIÓN

| Tarea | Estado | Tiempo | Prioridad |
|-------|--------|--------|-----------|
| Estructura base | ✅ Hecho | 3h | 🔴 Crítico |
| Stripe integration | ⏳ Próximo | 2h | 🔴 Crítico |
| Mercado Pago | ⏳ Próximo | 2h | 🟠 Alto |
| EmailJS | ✅ Hecho | 1h | 🔴 Crítico |
| Testing E2E | ⏳ Próximo | 2h | 🟠 Alto |
| UI/UX Polish | ⏳ Próximo | 3h | 🟡 Medio |
| **TOTAL** | | **13h** | |

---

## 🚀 PRÓXIMOS PASOS

### Semana 1 (Hoy - Mañana)

- [ ] Elegir Stripe O Mercado Pago
- [ ] Obtener credenciales
- [ ] Instalar dependencias
- [ ] Implementar Payment Form

### Semana 2

- [ ] Testing del flujo completo
- [ ] Webhooks para actualizar estado
- [ ] UI refinement
- [ ] Testing en staging

### Semana 3

- [ ] Deploy a producción
- [ ] Monitoreo
- [ ] Documentación final

---

## 🆘 TROUBLESHOOTING

### "La orden no se guarda en Firebase"

- Verifica que `NEXT_DATABASE_URL` esté correcto
- Checkea las reglas de Firebase (debe permitir escritura)
- Revisa los logs del navegador (F12 → Console)

### "Email no llega"

- Verifica credenciales de EmailJS
- Checkea SPAM folder
- Revisa logs en EmailJS Dashboard

### "Pago falla"

- Verifica claves de Stripe/MP
- Usa modo de prueba (test keys)
- Checkea la consola para errores

---

## 📚 RECURSOS

- **Stripe**: <https://stripe.com/docs>
- **Mercado Pago**: <https://www.mercadopago.com.ar/developers>
- **EmailJS**: <https://www.emailjs.com/docs/>
- **Firebase**: <https://firebase.google.com/docs/>

---

**¿Prefieres implementar Stripe o Mercado Pago?**

Responde y continuaremos con la integración del procesador de pagos elegido.
