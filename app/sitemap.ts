import type { MetadataRoute } from "next";
import { fetchMainProducts, fetchHomeProducts } from "../src/lib/api";

/**
 * Dynamic Sitemap Generator
 * 
 * Generates a complete sitemap including:
 * - Static pages (home, contact, products list, etc.)
 * - Dynamic product pages from Firebase
 * - Home featured products
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://autonivelante.cl";
    const now = new Date();

    // Static routes with priorities and change frequencies
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/homeproducts`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact-page`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/cart`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.4,
        },
        {
            url: `${baseUrl}/checkout`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/modalvideo`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    // Fetch dynamic product routes
    let mainProductRoutes: MetadataRoute.Sitemap = [];
    let homeProductRoutes: MetadataRoute.Sitemap = [];

    try {
        // Fetch main products
        const mainProducts = await fetchMainProducts();
        if (Array.isArray(mainProducts) && mainProducts.length > 0) {
            mainProductRoutes = mainProducts
                .filter((product) => product && product.id)
                .map((product) => ({
                    url: `${baseUrl}/products/${product.id}`,
                    lastModified: now,
                    changeFrequency: "weekly" as const,
                    priority: 0.8,
                }));
        }
    } catch (error) {
        console.error("sitemap.ts: Error fetching main products", error);
    }

    try {
        // Fetch home featured products
        const homeProducts = await fetchHomeProducts();
        if (Array.isArray(homeProducts) && homeProducts.length > 0) {
            homeProductRoutes = homeProducts
                .filter((product) => product && product.id)
                .map((product) => ({
                    url: `${baseUrl}/homeproducts/${product.id}`,
                    lastModified: now,
                    changeFrequency: "weekly" as const,
                    priority: 0.8,
                }));
        }
    } catch (error) {
        console.error("sitemap.ts: Error fetching home products", error);
    }

    // Combine all routes
    return [...staticRoutes, ...mainProductRoutes, ...homeProductRoutes];
}
