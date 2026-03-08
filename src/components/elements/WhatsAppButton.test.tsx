import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WhatsAppButton from "./WhatsAppButton";

describe("WhatsAppButton Component", () => {
  it("should render WhatsApp link", () => {
    render(<WhatsAppButton />);

    const link = screen.getByRole("link");

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("should have correct WhatsApp phone and message", () => {
    render(<WhatsAppButton />);

    const link = screen.getByRole("link");
    const href = link.getAttribute("href");

    expect(href).toContain("phone=56971447333");
    expect(href).toContain("Autonivelante");
  });

  it("should have animated image icon", () => {
    render(<WhatsAppButton />);

    const image = screen.getByRole("img");

    expect(image).toBeInTheDocument();
    expect(image).toHaveClass("wsp-image");
    expect(image).toHaveClass("animated");
    expect(image).toHaveClass("tada");
    expect(image).toHaveClass("infinite");
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

    const button = screen.getByRole("link");
    await user.hover(button);

    expect(
      await screen.findByText(/en que te podemos ayudar/i)
    ).toBeInTheDocument();
  });
});
