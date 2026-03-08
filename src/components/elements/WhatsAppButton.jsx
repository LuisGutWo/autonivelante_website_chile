import React from "react";
import { Image } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const renderTooltip = (props) => (
  <Tooltip id="button-tooltip" {...props}>
    Hola. En que te podemos ayudar?
  </Tooltip>
);

const WhatsAppButton = () => {
  return (
    <OverlayTrigger
      placement="left"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <a
        rel=""
        href="https://api.whatsapp.com/send?phone=56971447333&text=Hola, Somos Autonivelante. En que podemos ayudarte...😀"
        className="btn-wsp"
        target="_blank"
      >
        <Image
          src="/assets/images/icons/wa_chat_icon.webp"
          alt="WhatsApp Icon"
          className="wsp-image animated tada infinite"
        />
      </a>
    </OverlayTrigger>
  );
};

export default WhatsAppButton;
