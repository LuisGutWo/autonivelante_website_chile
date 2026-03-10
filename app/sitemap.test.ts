/**
 * Sitemap Integration Tests
 * 
 * Tests to validate the dynamic sitemap generation
 * including static routes and dynamic product routes from Firebase.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { MetadataRoute } from "next";

// Mock the API functions
vi.mock("../src/lib/api", () => ({
    fetchMainProducts: vi.fn(),
    fetchHomeProducts: vi.fn(),
}));

describe("Sitemap Generation", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("generates sitemap with static routes", async () => {
        const { fetchMainProducts, fetchHomeProducts } = await import("../src/lib/api");
        const sitemap = (await import("./sitemap")).default;

        // Mock empty product responses
        vi.mocked(fetchMainProducts).mockResolvedValue([]);
        vi.mocked(fetchHomeProducts).mockResolvedValue([]);

        const result = await sitemap();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThanOrEqual(8); // At least static routes

        // Verify static routes exist
        const urls = result.map((entry) => entry.url);
        expect(urls).toContain("https://autonivelante.cl/");
        expect(urls).toContain("https://autonivelante.cl/products");
        expect(urls).toContain("https://autonivelante.cl/contact-page");
        expect(urls).toContain("https://autonivelante.cl/projects");
    });

    it("includes main products in sitemap", async () => {
        const { fetchMainProducts, fetchHomeProducts } = await import("../src/lib/api");
        const sitemap = (await import("./sitemap")).default;

        // Mock main products
        vi.mocked(fetchMainProducts).mockResolvedValue([
            { id: "P001", title: "Product 1", price: 1000 },
            { id: "P002", title: "Product 2", price: 2000 },
        ] as any);

        vi.mocked(fetchHomeProducts).mockResolvedValue([]);

        const result = await sitemap();
        const urls = result.map((entry) => entry.url);

        expect(urls).toContain("https://autonivelante.cl/products/P001");
        expect(urls).toContain("https://autonivelante.cl/products/P002");
    });

    it("includes home featured products in sitemap", async () => {
        const { fetchMainProducts, fetchHomeProducts } = await import("../src/lib/api");
        const sitemap = (await import("./sitemap")).default;

        vi.mocked(fetchMainProducts).mockResolvedValue([]);

        // Mock home products
        vi.mocked(fetchHomeProducts).mockResolvedValue([
            { id: "H001", title: "Home Product 1", price: 1500 },
            { id: "H002", title: "Home Product 2", price: 2500 },
        ] as any);

        const result = await sitemap();
        const urls = result.map((entry) => entry.url);

        expect(urls).toContain("https://autonivelante.cl/homeproducts/H001");
        expect(urls).toContain("https://autonivelante.cl/homeproducts/H002");
    });

    it("handles API errors gracefully", async () => {
        const { fetchMainProducts, fetchHomeProducts } = await import("../src/lib/api");
        const sitemap = (await import("./sitemap")).default;

        // Mock API errors
        vi.mocked(fetchMainProducts).mockRejectedValue(new Error("API Error"));
        vi.mocked(fetchHomeProducts).mockRejectedValue(new Error("API Error"));

        const result = await sitemap();

        // Should still return static routes even if API fails
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThanOrEqual(8);

        const urls = result.map((entry) => entry.url);
        expect(urls).toContain("https://autonivelante.cl/");
    });

    it("filters out invalid products without id", async () => {
        const { fetchMainProducts, fetchHomeProducts } = await import("../src/lib/api");
        const sitemap = (await import("./sitemap")).default;

        // Mock products with some invalid entries
        vi.mocked(fetchMainProducts).mockResolvedValue([
            { id: "P001", title: "Valid Product", price: 1000 },
            { title: "Invalid - No ID", price: 2000 } as any,
            null as any,
            { id: "P003", title: "Another Valid", price: 3000 },
        ] as any);

        vi.mocked(fetchHomeProducts).mockResolvedValue([]);

        const result = await sitemap();
        const urls = result.map((entry) => entry.url);

        // Should only include valid products
        expect(urls).toContain("https://autonivelante.cl/products/P001");
        expect(urls).toContain("https://autonivelante.cl/products/P003");

        // Should not include invalid entries
        expect(urls.filter((url) => url.includes("undefined"))).toHaveLength(0);
    });

    it("sets correct priorities for different route types", async () => {
        const { fetchMainProducts, fetchHomeProducts } = await import("../src/lib/api");
        const sitemap = (await import("./sitemap")).default;

        vi.mocked(fetchMainProducts).mockResolvedValue([
            { id: "P001", title: "Product", price: 1000 },
        ] as any);

        vi.mocked(fetchHomeProducts).mockResolvedValue([]);

        const result = await sitemap();

        // Check home page priority
        const homePage = result.find((entry) => entry.url === "https://autonivelante.cl/");
        expect(homePage?.priority).toBe(1);

        // Check products page priority
        const productsPage = result.find((entry) => entry.url === "https://autonivelante.cl/products");
        expect(productsPage?.priority).toBe(0.9);

        // Check individual product priority
        const productPage = result.find((entry) => entry.url === "https://autonivelante.cl/products/P001");
        expect(productPage?.priority).toBe(0.8);

        // Check cart priority is lower
        const cartPage = result.find((entry) => entry.url === "https://autonivelante.cl/cart");
        expect(cartPage?.priority).toBe(0.4);
    });

    it("sets correct change frequencies", async () => {
        const { fetchMainProducts, fetchHomeProducts } = await import("../src/lib/api");
        const sitemap = (await import("./sitemap")).default;

        vi.mocked(fetchMainProducts).mockResolvedValue([]);
        vi.mocked(fetchHomeProducts).mockResolvedValue([]);

        const result = await sitemap();

        // Check home page frequency
        const homePage = result.find((entry) => entry.url === "https://autonivelante.cl/");
        expect(homePage?.changeFrequency).toBe("weekly");

        // Check projects frequency
        const projectsPage = result.find((entry) => entry.url === "https://autonivelante.cl/projects");
        expect(projectsPage?.changeFrequency).toBe("monthly");

        // Check cart frequency
        const cartPage = result.find((entry) => entry.url === "https://autonivelante.cl/cart");
        expect(cartPage?.changeFrequency).toBe("daily");
    });

    it("includes lastModified timestamp", async () => {
        const { fetchMainProducts, fetchHomeProducts } = await import("../src/lib/api");
        const sitemap = (await import("./sitemap")).default;

        vi.mocked(fetchMainProducts).mockResolvedValue([]);
        vi.mocked(fetchHomeProducts).mockResolvedValue([]);

        const before = new Date();
        const result = await sitemap();
        const after = new Date();

        // All entries should have lastModified
        result.forEach((entry) => {
            expect(entry.lastModified).toBeDefined();

            if (entry.lastModified && entry.lastModified instanceof Date) {
                expect(entry.lastModified.getTime()).toBeGreaterThanOrEqual(before.getTime());
                expect(entry.lastModified.getTime()).toBeLessThanOrEqual(after.getTime());
            }
        });
    });

    it("returns valid MetadataRoute.Sitemap structure", async () => {
        const { fetchMainProducts, fetchHomeProducts } = await import("../src/lib/api");
        const sitemap = (await import("./sitemap")).default;

        vi.mocked(fetchMainProducts).mockResolvedValue([
            { id: "P001", title: "Product", price: 1000 },
        ] as any);

        vi.mocked(fetchHomeProducts).mockResolvedValue([]);

        const result = await sitemap();

        // Validate structure of each entry
        result.forEach((entry) => {
            expect(entry).toHaveProperty("url");
            expect(entry).toHaveProperty("lastModified");
            expect(entry).toHaveProperty("changeFrequency");
            expect(entry).toHaveProperty("priority");

            expect(typeof entry.url).toBe("string");
            expect(entry.url).toMatch(/^https:\/\/autonivelante\.cl/);

            expect(["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]).toContain(
                entry.changeFrequency
            );

            expect(typeof entry.priority).toBe("number");
            expect(entry.priority).toBeGreaterThanOrEqual(0);
            expect(entry.priority).toBeLessThanOrEqual(1);
        });
    });
});
