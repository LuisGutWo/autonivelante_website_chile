import Card, { CardHeader, CardBody, CardFooter, CardImage } from "./Card";
import Button from "../Button";

export default {
  title: "Components/Common/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "elevated", "outlined", "filled", "ghost"],
      description: "Variante visual de la tarjeta",
    },
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
      description: "Tamaño de padding interno",
    },
    noPadding: {
      control: "boolean",
      description: "Elimina todo el padding",
    },
    hoverable: {
      control: "boolean",
      description: "Agrega efecto hover (elevación)",
    },
    clickable: {
      control: "boolean",
      description: "Hace la tarjeta clickeable",
    },
    disabled: {
      control: "boolean",
      description: "Estado deshabilitado (para tarjetas clickeables)",
    },
    onClick: {
      action: "clicked",
      description: "Callback cuando se hace click",
    },
    as: {
      control: "text",
      description: "Elemento HTML a renderizar",
    },
  },
};

// ==========================================
// BASIC VARIANTS
// ==========================================

export const Default = {
  args: {
    children: (
      <>
        <h3 style={{ marginTop: 0 }}>Card Title</h3>
        <p style={{ marginBottom: 0 }}>
          This is a default card with a subtle border and white background.
          Perfect for most use cases.
        </p>
      </>
    ),
  },
};

export const Elevated = {
  args: {
    variant: "elevated",
    children: (
      <>
        <h3 style={{ marginTop: 0 }}>Elevated Card</h3>
        <p style={{ marginBottom: 0 }}>
          This card has a shadow instead of a border, giving it a floating
          appearance.
        </p>
      </>
    ),
  },
};

export const Outlined = {
  args: {
    variant: "outlined",
    children: (
      <>
        <h3 style={{ marginTop: 0 }}>Outlined Card</h3>
        <p style={{ marginBottom: 0 }}>
          This card has a more prominent border for better visual separation.
        </p>
      </>
    ),
  },
};

export const Filled = {
  args: {
    variant: "filled",
    children: (
      <>
        <h3 style={{ marginTop: 0 }}>Filled Card</h3>
        <p style={{ marginBottom: 0 }}>
          This card has a subtle gray background, useful for nested content.
        </p>
      </>
    ),
  },
};

export const Ghost = {
  args: {
    variant: "ghost",
    children: (
      <>
        <h3 style={{ marginTop: 0 }}>Ghost Card</h3>
        <p style={{ marginBottom: 0 }}>
          This card has no border or shadow, blending with the background.
        </p>
      </>
    ),
  },
};

// ==========================================
// PADDING VARIANTS
// ==========================================

export const PaddingSizes = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Card padding="sm" variant="outlined">
        <strong>Small Padding (sm)</strong>
        <p style={{ marginBottom: 0 }}>Card with small padding</p>
      </Card>

      <Card padding="md" variant="outlined">
        <strong>Medium Padding (md)</strong>
        <p style={{ marginBottom: 0 }}>Card with medium padding (default)</p>
      </Card>

      <Card padding="lg" variant="outlined">
        <strong>Large Padding (lg)</strong>
        <p style={{ marginBottom: 0 }}>Card with large padding</p>
      </Card>

      <Card padding="xl" variant="outlined">
        <strong>Extra Large Padding (xl)</strong>
        <p style={{ marginBottom: 0 }}>Card with extra large padding</p>
      </Card>
    </div>
  ),
};

// ==========================================
// WITH SUBCOMPONENTS
// ==========================================

export const WithHeaderAndFooter = {
  render: () => (
    <Card variant="elevated">
      <CardHeader>
        <h3 style={{ margin: 0 }}>Product Name</h3>
        <span style={{ color: "var(--color-primary)", fontWeight: "bold" }}>
          $1,299,000
        </span>
      </CardHeader>

      <CardBody>
        High-quality self-leveling compound for professional floor finishing.
        Perfect for residential and commercial projects.
      </CardBody>

      <CardFooter>
        <span style={{ fontSize: "0.875rem" }}>In Stock</span>
        <Button size="sm" variant="primary">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const WithImage = {
  render: () => (
    <Card variant="elevated" noPadding style={{ maxWidth: "400px" }}>
      <CardImage
        src="/assets/images/carousel_services/1.png"
        alt="Product"
        aspectRatio="16/9"
      />

      <div style={{ padding: "var(--spacing-4)" }}>
        <h3 style={{ marginTop: 0 }}>Autonivelante Premium</h3>
        <p style={{ color: "var(--color-text-muted)", marginBottom: "1rem" }}>
          Professional-grade self-leveling compound for smooth, durable floors.
        </p>
        <Button fullWidth variant="primary">
          Ver Detalles
        </Button>
      </div>
    </Card>
  ),
};

// ==========================================
// INTERACTIVE CARDS
// ==========================================

export const Hoverable = {
  args: {
    variant: "elevated",
    hoverable: true,
    children: (
      <>
        <h3 style={{ marginTop: 0 }}>Hoverable Card</h3>
        <p style={{ marginBottom: 0 }}>
          Hover over this card to see the elevation effect.
        </p>
      </>
    ),
  },
};

export const Clickable = {
  args: {
    variant: "elevated",
    clickable: true,
    hoverable: true,
    onClick: () => alert("Card clicked!"),
    children: (
      <>
        <h3 style={{ marginTop: 0 }}>Clickable Card</h3>
        <p style={{ marginBottom: 0 }}>
          Click anywhere on this card. It's fully accessible via keyboard (Tab +
          Enter).
        </p>
      </>
    ),
  },
};

export const ClickableDisabled = {
  args: {
    variant: "elevated",
    clickable: true,
    disabled: true,
    children: (
      <>
        <h3 style={{ marginTop: 0 }}>Disabled Clickable Card</h3>
        <p style={{ marginBottom: 0 }}>
          This card is disabled and cannot be interacted with.
        </p>
      </>
    ),
  },
};

// ==========================================
// PRODUCT CARD EXAMPLE
// ==========================================

export const ProductCard = {
  render: () => (
    <div style={{ maxWidth: "350px" }}>
      <Card variant="elevated" noPadding hoverable>
        <CardImage
          src="/assets/images/carousel_services/1.png"
          alt="Autonivelante Premium"
          aspectRatio="4/3"
        />

        <div style={{ padding: "var(--spacing-4)" }}>
          <div style={{ marginBottom: "0.5rem" }}>
            <span
              style={{
                display: "inline-block",
                padding: "0.25rem 0.5rem",
                backgroundColor: "var(--color-success)",
                color: "white",
                borderRadius: "var(--border-radius-sm)",
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              En Stock
            </span>
          </div>

          <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
            Autonivelante Premium
          </h3>

          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.875rem",
              marginBottom: "1rem",
            }}
          >
            Compound profesional para pisos. Secado rápido, alta resistencia.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-muted)",
                  textDecoration: "line-through",
                }}
              >
                $1,499,000
              </span>
              <br />
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "var(--color-primary)",
                }}
              >
                $1,299,000
              </span>
            </div>

            <span
              style={{
                padding: "0.25rem 0.5rem",
                backgroundColor: "var(--color-error)",
                color: "white",
                borderRadius: "var(--border-radius-sm)",
                fontSize: "0.875rem",
                fontWeight: "bold",
              }}
            >
              -13%
            </span>
          </div>

          <Button
            fullWidth
            variant="primary"
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </svg>
            }
          >
            Agregar al Carrito
          </Button>
        </div>
      </Card>
    </div>
  ),
};

// ==========================================
// SERVICE CARD EXAMPLE
// ==========================================

export const ServiceCard = {
  render: () => (
    <div style={{ maxWidth: "400px" }}>
      <Card variant="outlined" hoverable>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--border-radius-md)",
            backgroundColor: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="white"
            viewBox="0 0 16 16"
          >
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z" />
          </svg>
        </div>

        <h3 style={{ marginTop: 0 }}>Instalación Profesional</h3>
        <p style={{ color: "var(--color-text-muted)", lineHeight: "1.6" }}>
          Ofrecemos servicios de instalación profesional con garantía extendida.
          Nuestro equipo cuenta con más de 10 años de experiencia.
        </p>

        <Button variant="outline" size="sm">
          Solicitar Cotización
        </Button>
      </Card>
    </div>
  ),
};

// ==========================================
// ALL VARIANTS GRID
// ==========================================

export const AllVariants = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1.5rem",
      }}
    >
      <Card variant="default">
        <h4 style={{ marginTop: 0 }}>Default</h4>
        <p style={{ marginBottom: 0, fontSize: "0.875rem" }}>
          Subtle border, white background
        </p>
      </Card>

      <Card variant="elevated">
        <h4 style={{ marginTop: 0 }}>Elevated</h4>
        <p style={{ marginBottom: 0, fontSize: "0.875rem" }}>
          Shadow instead of border
        </p>
      </Card>

      <Card variant="outlined">
        <h4 style={{ marginTop: 0 }}>Outlined</h4>
        <p style={{ marginBottom: 0, fontSize: "0.875rem" }}>
          Prominent border
        </p>
      </Card>

      <Card variant="filled">
        <h4 style={{ marginTop: 0 }}>Filled</h4>
        <p style={{ marginBottom: 0, fontSize: "0.875rem" }}>Gray background</p>
      </Card>

      <Card variant="ghost">
        <h4 style={{ marginTop: 0 }}>Ghost</h4>
        <p style={{ marginBottom: 0, fontSize: "0.875rem" }}>
          No border or shadow
        </p>
      </Card>
    </div>
  ),
};

// ==========================================
// PLAYGROUND
// ==========================================

export const Playground = {
  args: {
    variant: "elevated",
    padding: "md",
    hoverable: true,
    clickable: false,
    disabled: false,
    children: (
      <>
        <h3 style={{ marginTop: 0 }}>Interactive Playground</h3>
        <p style={{ marginBottom: 0 }}>
          Use the controls below to customize this card and see how different
          props affect its appearance and behavior.
        </p>
      </>
    ),
  },
};
