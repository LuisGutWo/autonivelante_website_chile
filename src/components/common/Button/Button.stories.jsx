import React from "react";
import Button from "./Button";

/**
 * Button -  Componente base de botón reutilizable
 *
 * El componente Button proporciona una interfaz consistente para todos los botones
 * de la aplicación, con múltiples variantes, tamaños y estados.
 */
export default {
  title: "Components/Common/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "outline",
        "ghost",
        "danger",
        "success",
        "link",
      ],
      description: "Variante visual del botón",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "Tamaño del botón",
    },
    fullWidth: {
      control: "boolean",
      description: "Si el botón ocupa todo el ancho disponible",
    },
    disabled: {
      control: "boolean",
      description: "Si el botón está deshabilitado",
    },
    loading: {
      control: "boolean",
      description: "Si el botón está en estado de carga",
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
      description: "Tipo de botón HTML",
    },
  },
};

/**
 * Botón primario - Estado por defecto
 */
export const Primary = {
  args: {
    children: "Button Primary",
    variant: "primary",
    size: "md",
  },
};

/**
 * Botón secundario
 */
export const Secondary = {
  args: {
    children: "Button Secondary",
    variant: "secondary",
    size: "md",
  },
};

/**
 * Botón con outline
 */
export const Outline = {
  args: {
    children: "Button Outline",
    variant: "outline",
    size: "md",
  },
};

/**
 * Botón ghost (sin borde)
 */
export const Ghost = {
  args: {
    children: "Button Ghost",
    variant: "ghost",
    size: "md",
  },
};

/**
 * Botón de peligro
 */
export const Danger = {
  args: {
    children: "Delete",
    variant: "danger",
    size: "md",
  },
};

/**
 * Botón de éxito
 */
export const Success = {
  args: {
    children: "Save",
    variant: "success",
    size: "md",
  },
};

/**
 * Botón tipo link
 */
export const Link = {
  args: {
    children: "Link Button",
    variant: "link",
    size: "md",
  },
};

/**
 * Todos los tamaños
 */
export const Sizes = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      alignItems: "flex-start",
    }}
  >
    <Button size="sm">Small Button</Button>
    <Button size="md">Medium Button</Button>
    <Button size="lg">Large Button</Button>
    <Button size="xl">Extra Large Button</Button>
  </div>
);

/**
 * Botón con íconos
 */
export const WithIcons = () => (
  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
    <Button
      leftIcon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      }
    >
      With Left Icon
    </Button>

    <Button
      rightIcon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      }
    >
      With Right Icon
    </Button>

    <Button
      leftIcon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      }
      rightIcon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      }
    >
      Both Icons
    </Button>
  </div>
);

/**
 * Estado de carga
 */
export const Loading = () => (
  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
    <Button loading>Loading...</Button>
    <Button variant="secondary" loading>
      Processing
    </Button>
    <Button variant="outline" loading>
      Please wait
    </Button>
  </div>
);

/**
 * Estado deshabilitado
 */
export const Disabled = () => (
  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
    <Button disabled>Disabled Primary</Button>
    <Button variant="secondary" disabled>
      Disabled Secondary
    </Button>
    <Button variant="outline" disabled>
      Disabled Outline
    </Button>
  </div>
);

/**
 * Ancho completo
 */
export const FullWidth = {
  args: {
    children: "Full Width Button",
    variant: "primary",
    fullWidth: true,
  },
};

/**
 * Todas las variantes
 */
export const AllVariants = () => (
  <div style={{ display: "grid", gap: "1rem" }}>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="danger">Danger</Button>
    <Button variant="success">Success</Button>
    <Button variant="link">Link</Button>
  </div>
);

/**
 * Ejemplo de uso en formulario
 */
export const InForm = () => (
  <div style={{ maxWidth: "400px" }}>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("Form submitted!");
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "500",
          }}
        >
          Email
        </label>
        <input
          type="email"
          placeholder="tu@email.com"
          style={{
            width: "100%",
            padding: "0.5rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <Button type="submit" fullWidth>
          Submit
        </Button>
        <Button type="reset" variant="outline" fullWidth>
          Reset
        </Button>
      </div>
    </form>
  </div>
);

/**
 * Playground interactivo
 */
export const Playground = {
  args: {
    children: "Interactive Button",
    variant: "primary",
    size: "md",
    fullWidth: false,
    disabled: false,
    loading: false,
    type: "button",
    onClick: () => alert("Button clicked!"),
  },
};
