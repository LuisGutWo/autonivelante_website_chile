import React, { useState, useMemo, useCallback } from "react";
import { Form, Button, Card, Alert, ProgressBar } from "react-bootstrap";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";
import { clearCart } from '../../../redux/slices/cartSlice';
import { formatPrice } from '../../config/formatPrice';
import { PaymentForm } from "./PaymentForm";
import { trackPurchase } from "../../lib/analytics";
import type {
  AddressInfo,
  BillingContactInfo,
  CartItem,
  CheckoutOrder,
} from "../../types";

type CheckoutFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  streetNumber: string;
  apartment: string;
  city: string;
  region: string;
  postalCode: string;
  billingName: string;
  billingEmail: string;
  billingPhone: string;
  notes: string;
};

type CheckoutField = keyof CheckoutFormData;
type CheckoutErrors = Partial<Record<CheckoutField, string>>;

interface CheckoutFormProps {
  onSubmit?: (order: CheckoutOrder) => void;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialFormData: CheckoutFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  streetNumber: "",
  apartment: "",
  city: "",
  region: "",
  postalCode: "",
  billingName: "",
  billingEmail: "",
  billingPhone: "",
  notes: "",
};

const CheckoutForm = ({ onSubmit, isProcessing, setIsProcessing }: CheckoutFormProps): React.ReactElement => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cartItems = useAppSelector((store) => store.cart);
  const [currentStep, setCurrentStep] = useState(1); // 1 = Envío, 2 = Facturación, 3 = Pago
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [orderObject, setOrderObject] = useState<CheckoutOrder | null>(null);

  // Memoizar cálculo de totales - Solo recalcula cuando cambia el carrito
  const { subtotal, shipping, total } = useMemo(() => {
    const calculatedSubtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0,
    );
    const calculatedShipping = calculatedSubtotal > 50000 ? 0 : 5000;
    const calculatedTotal = calculatedSubtotal + calculatedShipping;

    return {
      subtotal: calculatedSubtotal,
      shipping: calculatedShipping,
      total: calculatedTotal,
    };
  }, [cartItems]);

  const validateStep = (step: number): boolean => {
    const newErrors: CheckoutErrors = {};

    if (step === 1) {
      // Validar paso 1: Información de envío
      if (!formData.firstName.trim())
        newErrors.firstName = "El nombre es requerido";
      if (!formData.lastName.trim())
        newErrors.lastName = "El apellido es requerido";
      if (!formData.email.trim()) newErrors.email = "El email es requerido";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Email inválido";
      if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido";
      if (!formData.street.trim()) newErrors.street = "La calle es requerida";
      if (!formData.streetNumber.trim())
        newErrors.streetNumber = "El número es requerido";
      if (!formData.city.trim()) newErrors.city = "La ciudad es requerida";
      if (!formData.region.trim()) newErrors.region = "La región es requerida";
      if (!formData.postalCode.trim())
        newErrors.postalCode = "Código postal requerido";
    } else if (step === 2) {
      // Validar paso 2: Información de facturación
      if (!sameAsShipping) {
        if (!formData.billingName.trim())
          newErrors.billingName = "Nombre facturación requerido";
        if (!formData.billingEmail.trim())
          newErrors.billingEmail = "Email facturación requerido";
        if (!formData.billingPhone.trim())
          newErrors.billingPhone = "Teléfono facturación requerido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    const fieldName = name as CheckoutField;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const handleNextStep = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string): Promise<void> => {
    if (!orderObject) {
      toast.error("No se encontró la orden para finalizar el pago.");
      return;
    }

    setIsProcessing(true);

    try {
      // Enviar email de confirmación
      if (process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID && orderObject) {
        const total = orderObject.summary.total;
        const templateParams = {
          to_email: formData.email,
          customer_name: `${formData.firstName} ${formData.lastName}`,
          order_id: orderObject.orderId,
          order_total: formatPrice(total),
          order_items: cartItems
            .map((item) => `${item.title} x${item.qty}`)
            .join(", "),
          order_date: new Date().toLocaleDateString("es-CL"),
          payment_id: paymentIntentId,
        };

        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID ||
            "template_order_confirmation",
          templateParams,
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
        );
      }

      toast.success("¡Pago realizado exitosamente!");

      trackPurchase(
        orderObject.orderId,
        cartItems,
        orderObject.summary.total,
        orderObject.summary.shipping
      );

      // Limpiar carrito
      dispatch(clearCart());

      // Redirigir a confirmación
      router.push(`/order-confirmation?orderId=${orderObject.orderId}`);
    } catch (error: unknown) {
      logger.error(
        "Error al procesar el pago",
        error,
        { orderId: orderObject?.orderId },
        LogCategory.CHECKOUT
      );
      toast.error(
        "Hubo un error al procesar tu pago. Por favor, intenta nuevamente.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const prepareOrder = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!validateStep(1) || !validateStep(2)) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    // Usar totales memoizados
    // (subtotal, shipping y total ya están calculados arriba)

    // Crear objeto de orden
    const billingInfo: AddressInfo | BillingContactInfo = sameAsShipping
      ? {
          street: formData.street,
          streetNumber: formData.streetNumber,
          apartment: formData.apartment || "",
          city: formData.city,
          region: formData.region,
          postalCode: formData.postalCode,
        }
      : {
          name: formData.billingName,
          email: formData.billingEmail,
          phone: formData.billingPhone,
        };

    const newOrderObject: CheckoutOrder = {
      orderId: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      },
      shippingInfo: {
        street: formData.street,
        streetNumber: formData.streetNumber,
        apartment: formData.apartment || "",
        city: formData.city,
        region: formData.region,
        postalCode: formData.postalCode,
      },
      billingInfo,
      items: cartItems,
      summary: {
        subtotal,
        shipping,
        total,
      },
      notes: formData.notes,
      status: "pending_payment",
    };

    onSubmit?.(newOrderObject);

    // Guardar orden temporalmente
    setOrderObject(newOrderObject);
    setCurrentStep(3);
  };

  return (
    <div>
      {/* Indicador de progreso */}
      <div className="mb-4">
        <h6 className="mb-2">Paso {currentStep} de 3</h6>
        <ProgressBar
          now={(currentStep / 3) * 100}
          label={`${Math.round((currentStep / 3) * 100)}%`}
        />
      </div>

      {/* PASO 1: Información de Envío */}
      {currentStep === 1 && (
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Información de Envío</h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleNextStep}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  placeholder="Juan"
                  value={formData.firstName}
                  onChange={handleChange}
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Apellido *</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  placeholder="Pérez"
                  value={formData.lastName}
                  onChange={handleChange}
                  isInvalid={!!errors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="juan@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Teléfono *</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  placeholder="+56 9 XXXX XXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  isInvalid={!!errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </Form.Group>

              <hr />

              {/* Dirección */}
              <h6 className="mb-3">Dirección de Envío</h6>

              <Form.Group className="mb-3">
                <Form.Label>Calle *</Form.Label>
                <Form.Control
                  type="text"
                  name="street"
                  placeholder="Av. La Dehesa"
                  value={formData.street}
                  onChange={handleChange}
                  isInvalid={!!errors.street}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.street}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Número *</Form.Label>
                    <Form.Control
                      type="text"
                      name="streetNumber"
                      placeholder="1822"
                      value={formData.streetNumber}
                      onChange={handleChange}
                      isInvalid={!!errors.streetNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.streetNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Apto/Depto (Opcional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="apartment"
                      placeholder="430"
                      value={formData.apartment}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Región *</Form.Label>
                    <Form.Select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      isInvalid={!!errors.region}
                    >
                      <option value="">Selecciona una región</option>
                      <option value="Metropolitana">
                        Región Metropolitana
                      </option>
                      <option value="Valparaíso">Valparaíso</option>
                      <option value="Biobío">Biobío</option>
                      <option value="La Araucanía">La Araucanía</option>
                      <option value="Los Ríos">Los Ríos</option>
                      <option value="Los Lagos">Los Lagos</option>
                      <option value="Aysén">Aysén</option>
                      <option value="Magallanes">Magallanes</option>
                      <option value="Coquimbo">Coquimbo</option>
                      <option value="Atacama">Atacama</option>
                      <option value="Antofagasta">Antofagasta</option>
                      <option value="Tarapacá">Tarapacá</option>
                      <option value="Arica">Arica y Parinacota</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.region}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Ciudad *</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      placeholder="Santiago"
                      value={formData.city}
                      onChange={handleChange}
                      isInvalid={!!errors.city}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.city}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>

              <Form.Group className="mb-4">
                <Form.Label>Código Postal *</Form.Label>
                <Form.Control
                  type="text"
                  name="postalCode"
                  placeholder="8320000"
                  value={formData.postalCode}
                  onChange={handleChange}
                  isInvalid={!!errors.postalCode}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.postalCode}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Información de Facturación */}
              <hr />
              <h6 className="mb-3">Información de Facturación</h6>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  label="Usar la misma dirección para facturación"
                />
              </Form.Group>

              {!sameAsShipping && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre para Facturación *</Form.Label>
                    <Form.Control
                      type="text"
                      name="billingName"
                      value={formData.billingName}
                      onChange={handleChange}
                      isInvalid={!!errors.billingName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.billingName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email para Facturación *</Form.Label>
                    <Form.Control
                      type="email"
                      name="billingEmail"
                      value={formData.billingEmail}
                      onChange={handleChange}
                      isInvalid={!!errors.billingEmail}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.billingEmail}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono para Facturación *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="billingPhone"
                      value={formData.billingPhone}
                      onChange={handleChange}
                      isInvalid={!!errors.billingPhone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.billingPhone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </>
              )}

              {/* Notas */}
              <hr />
              <Form.Group className="mb-4">
                <Form.Label>Notas Adicionales (Opcional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  placeholder="Información adicional sobre tu pedido..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Botones */}
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={() => window.history.back()}
                  disabled={isProcessing}
                >
                  Atrás
                </Button>
                <Button
                  type="submit"
                  className="theme-btn-one ms-auto"
                  disabled={isProcessing}
                >
                  Siguiente: Facturación
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* PASO 2: Información de Facturación */}
      {currentStep === 2 && (
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Información de Facturación</h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={prepareOrder}>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  label="Usar la misma dirección para facturación"
                />
              </Form.Group>

              {!sameAsShipping && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre para Facturación *</Form.Label>
                    <Form.Control
                      type="text"
                      name="billingName"
                      value={formData.billingName}
                      onChange={handleChange}
                      isInvalid={!!errors.billingName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.billingName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email para Facturación *</Form.Label>
                    <Form.Control
                      type="email"
                      name="billingEmail"
                      value={formData.billingEmail}
                      onChange={handleChange}
                      isInvalid={!!errors.billingEmail}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.billingEmail}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Teléfono para Facturación *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="billingPhone"
                      value={formData.billingPhone}
                      onChange={handleChange}
                      isInvalid={!!errors.billingPhone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.billingPhone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </>
              )}

              {/* Notas */}
              <Form.Group className="mb-4">
                <Form.Label>Notas Adicionales (Opcional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  placeholder="Información adicional sobre tu pedido..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Botones */}
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={handlePreviousStep}
                  disabled={isProcessing}
                >
                  Atrás
                </Button>
                <Button
                  type="submit"
                  className="theme-btn-one ms-auto"
                  disabled={isProcessing}
                >
                  Siguiente: Pago
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* PASO 3: Pago */}
      {currentStep === 3 && orderObject && (
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Información de Pago</h5>
          </Card.Header>
          <Card.Body>
            <Alert variant="info">
              <strong>Resumen de la Orden:</strong>
              <br />
              Subtotal: {formatPrice(orderObject.summary.subtotal)}
              <br />
              Envío:{" "}
              {orderObject.summary.shipping === 0
                ? "Gratis"
                : formatPrice(orderObject.summary.shipping)}
              <br />
              <strong>Total: {formatPrice(orderObject.summary.total)}</strong>
            </Alert>

            <PaymentForm
              orderId={orderObject.orderId}
              amount={orderObject.summary.total}
              onPaymentSuccess={handlePaymentSuccess}
              isProcessing={isProcessing}
            />

            <Button
              variant="outline-secondary"
              onClick={handlePreviousStep}
              disabled={isProcessing}
              className="mt-3"
            >
              Atrás
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default CheckoutForm;
