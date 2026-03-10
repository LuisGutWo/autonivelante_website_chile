import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Image } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { MessageCircle, Phone, Mail } from "lucide-react";
import { trackContactClick } from "../../lib/analytics";

const DEFAULT_WHATSAPP_NUMBER = "56971447333";
const DEFAULT_WHATSAPP_MESSAGE =
  "Hola, necesito informacion sobre productos y servicios de Autonivelante Chile.";

const normalizePhone = (value: string): string => value.replace(/\D/g, "");

export const buildWhatsAppUrl = (phone: string, message: string): string => {
  const safePhone = normalizePhone(phone || DEFAULT_WHATSAPP_NUMBER);
  const safeMessage = encodeURIComponent(message || DEFAULT_WHATSAPP_MESSAGE);

  return `https://wa.me/${safePhone}?text=${safeMessage}`;
};

const renderTooltip = (props: any): React.ReactElement => (
  <Tooltip id="whatsapp-contact-tooltip" {...props}>
    Contacto rápido: WhatsApp, llamada o formulario.
  </Tooltip>
);

const WhatsAppButton: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const phone =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;
  const message =
    process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE ||
    DEFAULT_WHATSAPP_MESSAGE;
  const normalizedPhone = normalizePhone(phone);
  const whatsappUrl = buildWhatsAppUrl(phone, message);
  const callUrl = `tel:+${normalizedPhone}`;

  const handlePhoneClick = (
    event: React.MouseEvent<HTMLAnchorElement>
  ): void => {
    trackContactClick("phone", "floating_panel");
    setIsPanelOpen(false);

    // Keep anchor semantics but force tel navigation for browsers that ignore it
    // when React state updates happen in the same click cycle.
    event.preventDefault();
    window.location.assign(callUrl);
  };

  useEffect(() => {
    if (!isPanelOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent): void => {
      const target = event.target as Node;

      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setIsPanelOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setIsPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isPanelOpen]);

  return (
    <div className="contact-fab" ref={wrapperRef}>
      <OverlayTrigger
        placement="left"
        delay={{ show: 200, hide: 250 }}
        trigger={["hover", "focus"]}
        overlay={renderTooltip}
      >
        <button
          type="button"
          className={`btn-wsp btn-wsp-toggle ${isPanelOpen ? "is-open" : ""}`}
          title="Abrir canales de contacto"
          aria-haspopup="true"
          aria-label={`${
            isPanelOpen ? "Cerrar" : "Abrir"
          } opciones de contacto rápido`}
          data-expanded={isPanelOpen ? "true" : "false"}
          onClick={() => setIsPanelOpen((current) => !current)}
        >
          <span className="visually-hidden">
            {isPanelOpen ? "Cerrar" : "Abrir"} opciones de contacto
          </span>
          <Image
            src="/assets/images/icons/wa_chat_icon.webp"
            alt="WhatsApp"
            className="wsp-image"
            width={100}
            height={100}
          />
        </button>
      </OverlayTrigger>

      <nav
        id="quick-contact-panel"
        className={`btn-wsp-panel ${isPanelOpen ? "is-visible" : ""}`}
        aria-label="Canales de contacto rápido"
      >
        <a
          rel="noopener noreferrer"
          href={whatsappUrl}
          target="_blank"
          className="btn-wsp-link btn-wsp-link--whatsapp"
          aria-label="Contactar por WhatsApp (nueva pestaña)"
          data-contact-channel="whatsapp"
          onClick={() => {
            trackContactClick("whatsapp", "floating_panel");
            setIsPanelOpen(false);
          }}
        >
          <MessageCircle size={18} strokeWidth={2.25} aria-hidden="true" />
          <span className="btn-wsp-link__label">WhatsApp</span>
        </a>

        <a
          href={callUrl}
          className="btn-wsp-link btn-wsp-link--phone"
          aria-label="Llamar por teléfono"
          data-contact-channel="phone"
          onClick={handlePhoneClick}
        >
          <Phone size={18} strokeWidth={2.25} aria-hidden="true" />
          <span className="btn-wsp-link__label">Llamar</span>
        </a>

        <Link
          href="/contact-page"
          className="btn-wsp-link btn-wsp-link--email"
          aria-label="Ir a la pagina de contacto"
          data-contact-channel="contact_form"
          onClick={() => {
            trackContactClick("contact_form", "floating_panel");
            setIsPanelOpen(false);
          }}
        >
          <Mail size={18} strokeWidth={2.25} aria-hidden="true" />
          <span className="btn-wsp-link__label">Contacto</span>
        </Link>
      </nav>
    </div>
  );
};

export default WhatsAppButton;
