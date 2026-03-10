import { useEffect } from "react";
import React from "react";

export default function DataBg(): React.ReactElement {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-bg]");

    elements.forEach((element) => {
      const bgUrl = element.getAttribute("data-bg");
      if (bgUrl) {
        element.style.backgroundImage = `url(${bgUrl})`;
      }
    });
  }, []);

  return <></>;
}
