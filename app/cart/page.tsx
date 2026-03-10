"use client";
import Breadcrumb from '../../src/components/common/Breadcrumb/Breadcrumb';
import CartProduct from '../../src/components/elements/cart/CartProduct';
import Link from "next/link";
import { useAppSelector } from "../../src/hooks/useRedux";
import { Button, Container, Table } from "react-bootstrap";
import Layout from '../../src/components/layout/Layout';
import CartCount from '../../src/components/common/CartCount';
import { formatPrice } from '../../src/config/formatPrice';
import CartProductEmpty from '../../src/components/elements/cart/CartProductEmpty';

export default function Cart() {
  const cartItems = useAppSelector((store) => store.cart);
  const subTotal =
    cartItems?.reduce((acc, { price, qty }) => acc + price * qty, 0) || 0;

  const cartHasItems = cartItems?.length > 0;

  return (
    <Layout headerStyle={2} footerStyle={1}>
      <Container className="mt_150 cart-container">
        <Breadcrumb
          items={[
            { name: "Productos", href: "/products" },
            { name: "Carrito", href: "/cart" },
          ]}
        />
        <h2 className="py-2 mt-5">Tu carrito</h2>
        <p className="mb-3 text-muted">
          Revisa tu selección, ajusta cantidades y continúa a un pago seguro.
        </p>
        <div className="mainfeat__bar"></div>
        <section className="cart-section p_relative">
          <div className="auto-container">
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12 col-sm-12 table-column d-flex justify-content-center align-items-center">
                <div className="table-outer">
                  <Table className="cart-table">
                    <thead className="cart-header">
                      <tr>
                        <th aria-label="Acciones">&nbsp;</th>
                        <th className="prod-column" colSpan={4}>
                          Producto
                        </th>
                        <th className="price">Total</th>
                        <th className="quantity">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!cartHasItems ? (
                        <CartProductEmpty />
                      ) : (
                        cartItems.map((item) => (
                          <CartProduct key={item.id} cartItem={item} />
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
              <div className="othre-content">
                <div className="d-flex flex-wrap gap-3 ms-auto pe-4">
                  <Link href="/products">
                    <Button type="button" className="theme-btn-two text-light">
                      Continuar comprando
                    </Button>
                  </Link>
                  {cartHasItems ? (
                    <Link href="/checkout">
                      <Button type="button" className="theme-btn-one text-light">
                        Proceder al pago
                      </Button>
                    </Link>
                  ) : null}
                </div>
              </div>
              <div className="cart-total">
                <div className="row">
                  <div className="col-xl-5 col-lg-12 col-md-12 offset-xl-7 cart-column">
                    <div className="total-cart-box clearfix">
                      <h3
                        className="fs_20 b_radius_5 fw_medium lh_50 d-flex justify-content-start ps-4 align-items-center text-dark"
                        style={{ backgroundColor: "#015c9320" }}
                      >
                        Resumen de compra
                      </h3>
                      <ul className="list clearfix mb_30">
                        <li>
                          Cantidad de productos:
                          <span>
                            <CartCount />
                          </span>
                        </li>
                        <li>
                          Subtotal de productos:<span>{formatPrice(subTotal)}</span>
                        </li>
                        <li>
                          Total estimado:<span>{formatPrice(subTotal)}</span>
                        </li>
                      </ul>
                      <p className="px-4 pb-3 mb-0 text-muted">
                        El costo de despacho se calcula en el checkout.
                      </p>
                      <Link
                        href={cartHasItems ? "/checkout" : "/products"}
                        className="theme-btn-one"
                      >
                        {cartHasItems ? "Continuar al checkout" : "Explorar productos"}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}
