import React from "react";
import { Image } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import "animate.css";

const renderTooltip = (props: any): React.ReactElement => (
  <Tooltip id="button-tooltip" {...props}>
    Hola. En que te podemos ayudar?
  </Tooltip>
);

const WhatsAppButton: React.FC = () => {
  return (
    <OverlayTrigger
      placement="left"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <a
        rel="noopener noreferrer"
        href="https://api.whatsapp.com/send?phone=56971447333&text=Hola, Somos Autonivelante. En que podemos ayudarte...😀"
        className="btn-wsp"
        target="_blank"
        title="Contacta con nosotros por WhatsApp"
        aria-label="Abre WhatsApp para contactarnos"
      >
        <Image
          src="/assets/images/icons/wa_chat_icon.webp"
          alt="" // Dejar vacío porque el <a> tiene aria-label
          className="wsp-image animate__animated animate__tada animate__infinite animate__slower"
          width={40}
          height={40}
        />
      </a>
    </OverlayTrigger>
  );
};

export default WhatsAppButton;
