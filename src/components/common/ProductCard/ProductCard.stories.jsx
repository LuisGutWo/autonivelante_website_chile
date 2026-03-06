import ProductCard from "./ProductCard";

// Mock data
const mockProduct = {
  id: 1,
  title: "Autonivelante Premium 25kg",
  price: 1299000,
  image: "/assets/images/carousel_services/1.png",
  imageHeight: 200,
  imageWidth: 100,
};

const mockCartItem = {
  id: 1,
  title: "Autonivelante Premium 25kg",
  price: 1299000,
  image: "/assets/images/carousel_services/1.png",
  qty: 2,
};

export default {
  title: "Components/Common/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["grid", "cart"],
      description: "Tipo de visualización",
    },
    product: {
      description: "Objeto del producto",
    },
    disableAddToCart: {
      control: "boolean",
      description: "Desabilitar botón de agregar al carrito",
    },
  },
};

// ==========================================
// GRID VARIANT
// ==========================================

export const GridVariant = {
  args: {
    variant: "grid",
    product: mockProduct,
    href: "/products/1",
    index: 0,
  },
};

export const GridVariantDisabled = {
  args: {
    variant: "grid",
    product: mockProduct,
    href: "/products/1",
    disableAddToCart: true,
    index: 1,
  },
};

// ==========================================
// CART VARIANT
// ==========================================

export const CartVariant = {
  args: {
    variant: "cart",
    product: mockCartItem,
  },
};

export const CartVariantMultiple = {
  args: {
    variant: "cart",
    product: {
      ...mockCartItem,
      qty: 5,
    },
  },
};

// ==========================================
// MULTIPLE PRODUCTS GRID
// ==========================================

export const MultipleProductsGrid = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "2rem",
        padding: "2rem",
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <ProductCard
          key={i}
          variant="grid"
          product={{
            ...mockProduct,
            id: i,
            title: `Autonivelante Premium ${i * 25}kg`,
            price: 1299000 + i * 50000,
          }}
          href={`/products/${i}`}
          index={i - 1}
        />
      ))}
    </div>
  ),
};

// ==========================================
// CART TABLE
// ==========================================

export const CartTable = {
  render: () => (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid #ddd" }}>
          <th style={{ padding: "1rem", textAlign: "left" }}>Eliminar</th>
          <th style={{ padding: "1rem", textAlign: "left" }} colSpan="4">
            Producto
          </th>
          <th style={{ padding: "1rem", textAlign: "right" }}>Subtotal</th>
          <th style={{ padding: "1rem", textAlign: "center" }}>Cantidad</th>
        </tr>
      </thead>
      <tbody>
        <ProductCard
          variant="cart"
          product={{
            ...mockCartItem,
            id: 1,
            qty: 2,
          }}
        />
        <ProductCard
          variant="cart"
          product={{
            ...mockCartItem,
            id: 2,
            title: "Autonivelante Estándar 20kg",
            price: 899000,
            qty: 1,
          }}
        />
        <ProductCard
          variant="cart"
          product={{
            ...mockCartItem,
            id: 3,
            title: "Sellador para Pisos 10L",
            price: 450000,
            qty: 3,
          }}
        />
      </tbody>
    </table>
  ),
};

// ==========================================
// ALL STATES
// ==========================================

export const AllStates = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
      {/* Grid active */}
      <div>
        <h3>Grid - Producto Normal</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            maxWidth: "320px",
          }}
        >
          <ProductCard
            variant="grid"
            product={mockProduct}
            href="/products/1"
            index={0}
          />
        </div>
      </div>

      {/* Grid disabled */}
      <div>
        <h3>Grid - Producto Deshabilitado</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            maxWidth: "320px",
          }}
        >
          <ProductCard
            variant="grid"
            product={mockProduct}
            href="/products/1"
            disableAddToCart={true}
            index={1}
          />
        </div>
      </div>

      {/* Cart */}
      <div>
        <h3>Carrito</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <ProductCard variant="cart" product={mockCartItem} />
          </tbody>
        </table>
      </div>
    </div>
  ),
};

// ==========================================
// PLAYGROUND
// ==========================================

export const Playground = {
  args: {
    variant: "grid",
    product: mockProduct,
    href: "/products/1",
    disableAddToCart: false,
    index: 0,
  },
};
