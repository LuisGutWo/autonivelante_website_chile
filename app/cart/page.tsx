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
        <h2 className="py-2 mt-5">Tu Carrito</h2>
        <div className="mainfeat__bar"></div>
        <section className="cart-section p_relative">
          <div className="auto-container">
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12 col-sm-12 table-column d-flex justify-content-center align-items-center">
                <div className="table-outer">
                  <Table className="cart-table">
                    <thead className="cart-header">
                      <tr>
                        <th>&nbsp;</th>
                        <th className="prod-column">Producto</th>
                        <th>&nbsp;</th>
                        <th>&nbsp;</th>
                        <th className="price">Precio</th>
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
                <div className="ms-auto pe-4">
                  <Link href="/cart">
                    <Button type="button" className="theme-btn-two text-light">
                      Actualizar Carrito
                    </Button>
                  </Link>
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
                        Detalle del Carrito
                      </h3>
                      <ul className="list clearfix mb_30">
                        <li>
                          Total items:
                          <span>
                            <CartCount />
                          </span>
                        </li>
                        <li>
                          Subtotal:<span>{formatPrice(subTotal)}</span>
                        </li>
                        <li>
                          Total:<span>{formatPrice(subTotal)}</span>
                        </li>
                      </ul>
                      <Link href="/checkout" className="theme-btn-one">
                        Ir al Checkout
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
