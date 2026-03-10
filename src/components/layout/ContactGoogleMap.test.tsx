import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactGoogleMap from "./ContactGoogleMap";

describe("ContactGoogleMap Component", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("", { status: 200 }),
    );

    const originalCreateElement = document.createElement.bind(document);

    vi.spyOn(document, "createElement").mockImplementation(
      ((tagName: string, options?: ElementCreationOptions) => {
        if (String(tagName).toLowerCase() === "iframe") {
          const mockedIframe = originalCreateElement("div", options);
          mockedIframe.setAttribute("data-mocked-iframe", "true");
          return mockedIframe as unknown as HTMLElement;
        }

        return originalCreateElement(tagName, options);
      }) as typeof document.createElement,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders Google Maps iframe with accessible title", () => {
    render(<ContactGoogleMap />);

    const iframe = screen.getByTitle("Autonivelante mapa");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("id", "map-canvas");
    expect(iframe).toHaveClass("map-canvas");
  });

  it("applies performance and privacy iframe attributes", () => {
    render(<ContactGoogleMap />);

    const iframe = screen.getByTitle("Autonivelante mapa");

    expect(iframe).toHaveAttribute("loading", "lazy");
    expect(iframe).toHaveAttribute(
      "referrerpolicy",
      "no-referrer-when-downgrade",
    );
    expect(iframe).toHaveAttribute("allowfullscreen");
  });

  it("uses expected Google Maps source and keyboard accessibility", () => {
    render(<ContactGoogleMap />);

    const iframe = screen.getByTitle("Autonivelante mapa");

    expect(iframe).toHaveAttribute("src", expect.stringContaining("google.com/maps/embed"));
    expect(iframe).toHaveAttribute("tabindex", "0");
    expect(iframe).toHaveAttribute("aria-hidden", "false");
  });
});
