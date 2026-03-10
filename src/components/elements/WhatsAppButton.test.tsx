import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import userEvent from "@testing-library/user-event";
import WhatsAppButton from "./WhatsAppButton";

describe("WhatsAppButton Component", () => {
  it("should render a toggle button for quick contact channels", () => {
    render(<WhatsAppButton />);

    const button = screen.getByRole("button", {
      name: /abrir opciones de contacto r[aá]pido/i,
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-expanded", "false");
  });

  it("should expand and expose all contact channels", async () => {
    const user = userEvent.setup();
    render(<WhatsAppButton />);

    const button = screen.getByRole("button", {
      name: /abrir opciones de contacto r[aá]pido/i,
    });
    await user.click(button);

    expect(button).toHaveAttribute("data-expanded", "true");
    expect(
      screen.getByRole("link", { name: /contactar por whatsapp/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /llamar por tel[eé]fono/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ir a la pagina de contacto/i })).toBeInTheDocument();
  });

  it("should have a robust wa.me URL with phone and encoded message", async () => {
    const user = userEvent.setup();
    render(<WhatsAppButton />);

    const button = screen.getByRole("button", {
      name: /abrir opciones de contacto r[aá]pido/i,
    });
    await user.click(button);

    const link = screen.getByRole("link", { name: /contactar por whatsapp/i });
    const href = link.getAttribute("href");

    expect(href).toContain("https://wa.me/56971447333");
    expect(href).toContain("text=");
    expect(href).toContain("Autonivelante%20Chile");
  });

  it("should expose a callable tel URL for the phone channel", async () => {
    const user = userEvent.setup();
    render(<WhatsAppButton />);

    const button = screen.getByRole("button", {
      name: /abrir opciones de contacto r[aá]pido/i,
    });
    await user.click(button);

    const callLink = screen.getByRole("link", { name: /llamar por tel[eé]fono/i });
    expect(callLink).toHaveAttribute("href", "tel:+56971447333");
  });

  it("should render the WhatsApp icon with accessible alternative text", () => {
    render(<WhatsAppButton />);

    const image = screen.getByRole("img");

    expect(image).toBeInTheDocument();
    expect(image).toHaveClass("wsp-image");
    expect(image).toHaveAttribute("alt", "WhatsApp");
  });

  it("should render image with WebP source", () => {
    render(<WhatsAppButton />);

    const image = screen.getByRole("img");

    expect(image).toHaveAttribute("src", expect.stringContaining(".webp"));
    expect(image).toHaveAttribute("src", expect.stringContaining("wa_chat"));
  });

  it("should show tooltip on hover", async () => {
    const user = userEvent.setup();
    render(<WhatsAppButton />);

    const button = screen.getByRole("button", {
      name: /abrir opciones de contacto r[aá]pido/i,
    });
    await user.hover(button);

    expect(await screen.findByText(/contacto r[aá]pido/i)).toBeInTheDocument();
  });

  it("should close panel when pressing Escape", async () => {
    const user = userEvent.setup();
    render(<WhatsAppButton />);

    const button = screen.getByRole("button", {
      name: /abrir opciones de contacto r[aá]pido/i,
    });
    await user.click(button);

    fireEvent.keyDown(document, { key: "Escape" });

    expect(button).toHaveAttribute("data-expanded", "false");
  });

  it("should have no critical accessibility violations", async () => {
    const { container } = render(<WhatsAppButton />);
    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
