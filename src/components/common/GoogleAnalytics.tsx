"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { trackPageView } from "../../lib/analytics";

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export default function GoogleAnalytics({
  measurementId,
}: GoogleAnalyticsProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!measurementId) {
      return;
    }

    const queryString =
      typeof window !== "undefined"
        ? window.location.search.replace(/^\?/, "")
        : "";
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;

    trackPageView(
      pagePath,
      typeof document !== "undefined" ? document.title : ""
    );
  }, [measurementId, pathname]);

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            send_page_view: false
          });
        `}
      </Script>
    </>
  );
}
