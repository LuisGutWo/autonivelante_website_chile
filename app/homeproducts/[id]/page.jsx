import React, { Suspense, lazy } from "react";
import { Container } from "react-bootstrap";
import Layout from '../../../src/components/layout/Layout';
import Breadcrumb from '../../../src/components/common/Breadcrumb/Breadcrumb';
import { notFound } from "next/navigation";
import ClientProductDetailHome from '../../../src/components/layout/ClientProductDetailHome';
import { fetchHomeProducts } from '../../../src/lib/api';

export async function generateStaticParams() {
  try {
    const response = await fetchHomeProducts();
    const products = response ?? [];

    if (!Array.isArray(products)) {
      console.error("generateStaticParams: response is not an array", response);
      return [];
    }

    return products
      .map((product) => {
        if (!product || !product.id) {
          console.warn(
            "generateStaticParams: Product is null or undefined, or missing id",
            product
          );
          return null;
        }

        return {
          id: product.id.toString(),
        };
      })
      .filter((params) => params !== null);
  } catch (error) {
    console.error(
      "generateStaticParams: Error generating static params",
      error
    );
    return [];
  }
}

export async function generateMetadata({ params }) {
  try {
    // Await params if it's a Promise
    const resolvedParams =
      params && typeof params.then === "function" ? await params : params;
    const response = await fetchHomeProducts();
    const products = response ?? [];

    if (!Array.isArray(products)) {
      console.error("generateMetadata: response is not an array", response);
      return { title: "Product not found" };
    }

    const product =
      products.find((p) => p?.id?.toString() === resolvedParams?.id) ?? null;

    if (!product || !product.id || !product.title) {
      console.error(
        "generateMetadata: product is null or undefined, or missing id/title",
        resolvedParams?.id,
        products
      );
      return { title: "Product not found" };
    }

    return {
      title: product.title || "Untitled Product",
    };
  } catch (error) {
    console.error("generateMetadata: Error fetching product metadata", error);
    return { title: "Error fetching product" };
  }
}

export default async function SingleProduct(props) {
  try {
    const params = props.params
      ? typeof props.params.then === "function"
        ? await props.params
        : props.params
      : {};
    const response = await fetchHomeProducts();

    if (!Array.isArray(response)) {
      console.error("SingleProduct: response.data is not an array", response);
      return notFound();
    }

    const product = response.find((p) => p.id.toString() === params.id);

    if (!product) {
      console.error(
        "SingleProduct: product is null or undefined",
        params.id,
        response
      );
      return notFound();
    }

    const { id, title } = product;

    return (
      <Layout headerStyle={2} footerStyle={1}>
        <Container className="mt_150 mb_200">
          <Breadcrumb
            items={[
              { name: "Productos", href: "/products" },
              { name: title, href: `/homeproducts/${id}` },
            ]}
          />
          <ClientProductDetailHome product={product} />
        </Container>
      </Layout>
    );
  } catch (error) {
    console.error("SingleProduct: Error fetching product data", error);
    return notFound();
  }
}
