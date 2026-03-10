/**
 * Web Vitals Monitoring Hook
 * 
 * Tracks Core Web Vitals metrics and reports them for performance monitoring.
 * 
 * ** IMPORTANTE: Requiere instalación de web-vitals **
 * ```bash
 * npm install web-vitals
 * ```
 * 
 * Core Web Vitals:
 * - LCP (Largest Contentful Paint): < 2.5s
 * - FID (First Input Delay): < 100ms
 * - CLS (Cumulative Layout Shift): < 0.1
 * 
 * Other metrics:
 * - FCP (First Contentful Paint): < 1.8s
 * - TTFB (Time to First Byte): < 600ms
 * 
 * @see https://web.dev/vitals/
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/analytics
 */

import { useEffect } from "react";

type Metric = {
    id: string;
    name: string;
    value: number;
    rating: "good" | "needs-improvement" | "poor";
};

interface VitalsOptions {
    /** Enable console logging of metrics in development */
    debug?: boolean;
    /** Callback to send metrics to analytics service */
    onMetric?: (metric: Metric) => void;
}

/**
 * Logs metric to console in development mode
 */
const logMetric = (metric: Metric): void => {
    if (process.env.NODE_ENV === "development") {
        const { name, value, rating } = metric;
        const color = rating === "good" ? "🟢" : rating === "needs-improvement" ? "🟡" : "🔴";

        console.log(
            `${color} ${name}:`,
            `${Math.round(value)}${name === "CLS" ? "" : "ms"}`,
            `(${rating})`
        );
    }
};

/**
 * Sends metric to analytics service
 * Replace this with your analytics implementation (GA4, Mixpanel, etc.)
 */
const sendToAnalytics = (metric: Metric): void => {
    // Example: Send to Google Analytics 4
    if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", metric.name, {
            value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
            event_category: "Web Vitals",
            event_label: metric.id,
            non_interaction: true,
        });
    }

    // Example: Custom analytics endpoint
    // fetch("/api/analytics", {
    //   method: "POST",
    //   body: JSON.stringify(metric),
    // });
};

/**
 * Hook to monitor Web Vitals metrics
 * 
 * @example
 * ```tsx
 * // First install: npm install web-vitals
 * // Then in your root layout or _app.tsx
 * function MyApp({ Component, pageProps }) {
 *   useWebVitals({ debug: true });
 *   return <Component {...pageProps} />;
 * }
 * ```
 */
export function useWebVitals(options: VitalsOptions = {}): void {
    const { debug = process.env.NODE_ENV === "development", onMetric } = options;

    useEffect(() => {
        // Dynamic import to avoid build errors if web-vitals is not installed
        const loadWebVitals = async (): Promise<void> => {
            try {
                const { onCLS, onFID, onLCP, onFCP, onTTFB } = await import("web-vitals");

                const handleMetric = (metric: Metric): void => {
                    if (debug) {
                        logMetric(metric);
                    }

                    if (onMetric) {
                        onMetric(metric);
                    } else {
                        sendToAnalytics(metric);
                    }
                };

                // Track all Core Web Vitals
                onCLS(handleMetric);
                onFID(handleMetric);
                onLCP(handleMetric);
                onFCP(handleMetric);
                onTTFB(handleMetric);
            } catch (error) {
                if (debug) {
                    console.warn("web-vitals not installed. Run: npm install web-vitals");
                }
            }
        };

        loadWebVitals();
    }, [debug, onMetric]);
}

/**
 * Report Web Vitals to console (for debugging)
 * Use this in your root layout or pages
 * 
 * @example
 * ```tsx
 * export function reportWebVitals(metric: Metric) {
 *   console.log(metric);
 * }
 * ```
 */
export function reportWebVitals(metric: Metric): void {
    logMetric(metric);
    sendToAnalytics(metric);
}

/**
 * Performance thresholds for each metric
 */
export const PERFORMANCE_THRESHOLDS = {
    LCP: {
        good: 2500,
        needsImprovement: 4000,
    },
    FID: {
        good: 100,
        needsImprovement: 300,
    },
    CLS: {
        good: 0.1,
        needsImprovement: 0.25,
    },
    FCP: {
        good: 1800,
        needsImprovement: 3000,
    },
    TTFB: {
        good: 600,
        needsImprovement: 1500,
    },
} as const;

/**
 * Get rating for a metric value
 */
export function getMetricRating(
    name: keyof typeof PERFORMANCE_THRESHOLDS,
    value: number
): "good" | "needs-improvement" | "poor" {
    const thresholds = PERFORMANCE_THRESHOLDS[name];

    if (value <= thresholds.good) {
        return "good";
    }

    if (value <= thresholds.needsImprovement) {
        return "needs-improvement";
    }

    return "poor";
}

export default useWebVitals;
