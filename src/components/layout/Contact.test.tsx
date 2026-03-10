import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";
import Contact from "./Contact";

vi.mock("../../hooks/useRedux", () => ({
  useAppSelector: vi.fn(),
}));

vi.mock("@emailjs/browser", () => ({
  default: {
    sendForm: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const { useAppSelector } = await import("../../hooks/useRedux");
const emailjs = (await import("@emailjs/browser")).default;
const toast = (await import("react-hot-toast")).default;

describe("Contact Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form fields with accessibility attributes", () => {
    vi.mocked(useAppSelector).mockReturnValue([]);

    render(<Contact />);

    const form = screen.getByRole("form", { name: "Formulario de contacto" });
    expect(form).toBeInTheDocument();

    expect(screen.getByLabelText("Nombre y Apellido")).toHaveAttribute(
      "aria-required",
      "true",
    );
    expect(screen.getByLabelText("Teléfono")).toHaveAttribute(
      "aria-required",
      "true",
    );
    expect(screen.getByLabelText("Correo electrónico")).toHaveAttribute(
      "aria-required",
      "true",
    );
    expect(screen.getByLabelText("Motivo de contacto")).toHaveAttribute(
      "aria-required",
      "true",
    );

    const selectedProducts = screen.getByLabelText("Productos seleccionados");
    expect(selectedProducts).toHaveAttribute("readonly");
    expect(selectedProducts).toHaveAttribute("aria-readonly", "true");
  });

  it("shows empty-cart message in selected products textarea", () => {
    vi.mocked(useAppSelector).mockReturnValue([]);

    render(<Contact />);

    expect(screen.getByDisplayValue("Sin productos seleccionados")).toBeInTheDocument();
  });

  it("has no critical accessibility violations", async () => {
    vi.mocked(useAppSelector).mockReturnValue([]);

    const { container } = render(<Contact />);
    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });

  it("formats selected products from cart in textarea", () => {
    vi.mocked(useAppSelector).mockReturnValue([
      {
        id: "p1",
        title: "Producto Test",
        price: 1000,
        qty: 2,
        image: "/test.webp",
      },
    ]);

    render(<Contact />);

    expect(
      screen.getByDisplayValue("2 - Producto Test - ($1.000) = $2.000"),
    ).toBeInTheDocument();
  });

  it("submits form successfully and shows success toast", async () => {
    vi.mocked(useAppSelector).mockReturnValue([]);
    vi.mocked(emailjs.sendForm).mockResolvedValue({ status: 200, text: "OK" } as never);

    render(<Contact />);

    fireEvent.change(screen.getByLabelText("Nombre y Apellido"), {
      target: { value: "Juan Perez" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "99999999" },
    });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "test@mail.com" },
    });
    fireEvent.change(screen.getByLabelText("Motivo de contacto"), {
      target: { value: "Consulta" },
    });

    fireEvent.submit(screen.getByRole("form", { name: "Formulario de contacto" }));

    await waitFor(() => {
      expect(emailjs.sendForm).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith("Enviado con exito.");
    });
  });

  it("shows error toast when email sending fails", async () => {
    vi.mocked(useAppSelector).mockReturnValue([]);
    vi.mocked(emailjs.sendForm).mockRejectedValue({ text: "Network error" } as never);

    render(<Contact />);

    fireEvent.change(screen.getByLabelText("Nombre y Apellido"), {
      target: { value: "Juan Perez" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "99999999" },
    });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "test@mail.com" },
    });
    fireEvent.change(screen.getByLabelText("Motivo de contacto"), {
      target: { value: "Consulta" },
    });

    fireEvent.submit(screen.getByRole("form", { name: "Formulario de contacto" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Algo salio mal.");
    });
  });
});
