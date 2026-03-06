import React from "react";

export default function ContactGoogleMap() {
  return (
    <section className="map-section-two">
      <div className="map-outer">
        {typeof window !== "undefined" && (
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3332.5909821956748!2d-70.52093392478363!3d-33.35563399266182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cbdc67ff7bcf%3A0x1a3245531eddb744!2sAv.%20La%20Dehesa%201822%2C%207690122%20Lo%20Barnechea%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl!4v1718694538875!5m2!1ses-419!2scl"
            height={570}
            style={{ border: 0, width: "100%" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>
    </section>
  );
}
