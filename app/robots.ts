import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/"],
        },
        sitemap: "https://autonivelante.cl/sitemap.xml",
        host: "https://autonivelante.cl",
    };
}
