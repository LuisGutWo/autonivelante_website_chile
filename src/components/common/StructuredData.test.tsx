/**
 * @vitest-environment happy-dom
 */

import { describe, it, expect } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import StructuredData, {
  createOrganizationSchema,
  createWebSiteSchema,
  createLocalBusinessSchema,
  createProductSchema,
  createBreadcrumbSchema,
} from "./StructuredData";

describe("StructuredData Component", () => {
  it("renders JSON-LD script tag with correct data", () => {
    const testData = { "@context": "https://schema.org", "@type": "Test" };
    const { container } = render(<StructuredData data={testData} />);
    
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();
    expect(script?.textContent).toBe(JSON.stringify(testData));
  });

  it("renders multiple schemas when called multiple times", () => {
    const data1 = { "@type": "Organization" };
    const data2 = { "@type": "WebSite" };
    
    const { container } = render(
      <>
        <StructuredData data={data1} />
        <StructuredData data={data2} />
      </>
    );
    
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBe(2);
  });
});

describe("Schema Generators", () => {
  describe("createOrganizationSchema", () => {
    it("generates valid Organization schema", () => {
      const schema = createOrganizationSchema();
      
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("Organization");
      expect(schema.name).toBe("Autonivelante Chile");
      expect(schema.url).toBe("https://autonivelante.cl");
      expect(schema.logo).toBeTruthy();
      expect(schema.address).toBeTruthy();
      expect(schema.contactPoint).toBeTruthy();
    });

    it("includes valid contact information", () => {
      const schema = createOrganizationSchema();
      
      expect(schema.contactPoint).toHaveProperty("@type", "ContactPoint");
      expect(schema.contactPoint).toHaveProperty("contactType", "customer service");
      expect(schema.contactPoint).toHaveProperty("areaServed", "CL");
    });

    it("includes valid postal address", () => {
      const schema = createOrganizationSchema();
      
      expect(schema.address).toHaveProperty("@type", "PostalAddress");
      expect(schema.address).toHaveProperty("addressCountry", "CL");
      expect(schema.address).toHaveProperty("addressRegion", "Región Metropolitana");
    });
  });

  describe("createWebSiteSchema", () => {
    it("generates valid WebSite schema", () => {
      const schema = createWebSiteSchema();
      
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("WebSite");
      expect(schema.name).toBe("Autonivelante Chile");
      expect(schema.url).toBe("https://autonivelante.cl");
      expect(schema.description).toBeTruthy();
    });

    it("includes search action", () => {
      const schema = createWebSiteSchema();
      
      expect(schema.potentialAction).toHaveProperty("@type", "SearchAction");
      expect(schema.potentialAction.target).toContain("{search_term_string}");
    });

    it("includes publisher information", () => {
      const schema = createWebSiteSchema();
      
      expect(schema.publisher).toHaveProperty("@type", "Organization");
      expect(schema.publisher.logo).toHaveProperty("@type", "ImageObject");
    });
  });

  describe("createLocalBusinessSchema", () => {
    it("generates valid LocalBusiness schema", () => {
      const schema = createLocalBusinessSchema();
      
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("LocalBusiness");
      expect(schema.name).toBe("Autonivelante Chile");
      expect(schema.telephone).toBeTruthy();
      expect(schema.priceRange).toBe("$$");
    });

    it("includes geo coordinates", () => {
      const schema = createLocalBusinessSchema();
      
      expect(schema.geo).toHaveProperty("@type", "GeoCoordinates");
      expect(schema.geo).toHaveProperty("latitude");
      expect(schema.geo).toHaveProperty("longitude");
      expect(typeof schema.geo.latitude).toBe("number");
      expect(typeof schema.geo.longitude).toBe("number");
    });

    it("includes opening hours", () => {
      const schema = createLocalBusinessSchema();
      
      expect(schema.openingHoursSpecification).toHaveProperty("@type", "OpeningHoursSpecification");
      expect(Array.isArray(schema.openingHoursSpecification.dayOfWeek)).toBe(true);
      expect(schema.openingHoursSpecification.opens).toBe("09:00");
      expect(schema.openingHoursSpecification.closes).toBe("18:00");
    });
  });

  describe("createProductSchema", () => {
    const mockProduct = {
      id: "P001",
      title: "Autonivelante Premium",
      price: 25000,
      description: "Producto de alta calidad",
      image: "https://example.com/product.jpg",
      category: "Construcción",
    };

    it("generates valid Product schema", () => {
      const schema = createProductSchema(mockProduct);
      
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("Product");
      expect(schema.name).toBe(mockProduct.title);
      expect(schema.sku).toBe(mockProduct.id);
      expect(schema.image).toBe(mockProduct.image);
      expect(schema.description).toBe(mockProduct.description);
    });

    it("includes valid offer information", () => {
      const schema = createProductSchema(mockProduct);
      
      expect(schema.offers).toHaveProperty("@type", "Offer");
      expect(schema.offers.priceCurrency).toBe("CLP");
      expect(schema.offers.price).toBe(mockProduct.price);
      expect(schema.offers.availability).toBe("https://schema.org/InStock");
    });

    it("includes brand information", () => {
      const schema = createProductSchema(mockProduct);
      
      expect(schema.brand).toHaveProperty("@type", "Brand");
      expect(schema.brand.name).toBe("Autonivelante Chile");
    });

    it("uses default image when not provided", () => {
      const productWithoutImage = { ...mockProduct, image: undefined };
      const schema = createProductSchema(productWithoutImage);
      
      expect(schema.image).toContain("default.webp");
    });

    it("uses default description when not provided", () => {
      const productWithoutDesc = { ...mockProduct, description: undefined };
      const schema = createProductSchema(productWithoutDesc);
      
      expect(schema.description).toContain(mockProduct.title);
    });

    it("uses default category when not provided", () => {
      const productWithoutCategory = { ...mockProduct, category: undefined };
      const schema = createProductSchema(productWithoutCategory);
      
      expect(schema.category).toBe("Construcción y Acabados");
    });
  });

  describe("createBreadcrumbSchema", () => {
    const mockBreadcrumbs = [
      { name: "Inicio", url: "https://autonivelante.cl" },
      { name: "Productos", url: "https://autonivelante.cl/products" },
      { name: "Producto Individual", url: "https://autonivelante.cl/products/P001" },
    ];

    it("generates valid BreadcrumbList schema", () => {
      const schema = createBreadcrumbSchema(mockBreadcrumbs);
      
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("BreadcrumbList");
      expect(Array.isArray(schema.itemListElement)).toBe(true);
      expect(schema.itemListElement.length).toBe(3);
    });

    it("creates correct list items with positions", () => {
      const schema = createBreadcrumbSchema(mockBreadcrumbs);
      
      schema.itemListElement.forEach((item: any, index: number) => {
        expect(item["@type"]).toBe("ListItem");
        expect(item.position).toBe(index + 1);
        expect(item.name).toBe(mockBreadcrumbs[index].name);
        expect(item.item).toBe(mockBreadcrumbs[index].url);
      });
    });

    it("handles single breadcrumb item", () => {
      const singleItem = [{ name: "Inicio", url: "https://autonivelante.cl" }];
      const schema = createBreadcrumbSchema(singleItem);
      
      expect(schema.itemListElement.length).toBe(1);
      expect(schema.itemListElement[0].position).toBe(1);
    });

    it("handles empty breadcrumb array", () => {
      const schema = createBreadcrumbSchema([]);
      
      expect(schema.itemListElement.length).toBe(0);
    });
  });
});

describe("Schema Integration", () => {
  it("all schemas have required @context and @type fields", () => {
    const schemas = [
      createOrganizationSchema(),
      createWebSiteSchema(),
      createLocalBusinessSchema(),
      createProductSchema({
        id: "P001",
        title: "Test",
        price: 1000,
      }),
      createBreadcrumbSchema([{ name: "Test", url: "https://test.com" }]),
    ];

    schemas.forEach((schema) => {
      expect(schema).toHaveProperty("@context", "https://schema.org");
      expect(schema).toHaveProperty("@type");
      expect(typeof schema["@type"]).toBe("string");
    });
  });

  it("schemas produce valid JSON when stringified", () => {
    const schemas = [
      createOrganizationSchema(),
      createWebSiteSchema(),
      createLocalBusinessSchema(),
      createProductSchema({
        id: "P001",
        title: "Test",
        price: 1000,
      }),
      createBreadcrumbSchema([{ name: "Test", url: "https://test.com" }]),
    ];

    schemas.forEach((schema) => {
      const jsonString = JSON.stringify(schema);
      expect(() => JSON.parse(jsonString)).not.toThrow();
      
      const parsed = JSON.parse(jsonString);
      expect(parsed["@context"]).toBe("https://schema.org");
    });
  });
});
