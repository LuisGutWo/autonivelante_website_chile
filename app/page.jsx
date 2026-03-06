import { Suspense } from "react";
import dynamic from "next/dynamic";
import Layout from "../src/components/layout/Layout";
import About from "../src/components/layout/About";
import Banner from "../src/components/layout/Banner";
import FeaturesBanner from "../src/components/layout/FeaturesBanner";
import MainFeatures from "../src/components/layout/MainFeatures";

const Services = dynamic(() => import("../src/components/layout/Services"), {
  suspense: true,
});

const ProductsCard = dynamic(
  () => import("../src/components/layout/ProductsCard"),
  {
    suspense: true,
  },
);

const Contact = dynamic(() => import("../src/components/layout/Contact"), {
  suspense: true,
});

export default function Home() {
  return (
    <Layout headerStyle={1} footerStyle={1}>
      <Banner />
      <FeaturesBanner />
      <About />
      <Suspense
        fallback={
          <section className="sec-pad text-center">
            Cargando secciones...
          </section>
        }
      >
        <Services />
      </Suspense>
      <MainFeatures />
      <Suspense
        fallback={
          <section className="sec-pad text-center">
            Cargando productos...
          </section>
        }
      >
        <ProductsCard />
      </Suspense>
      <Suspense
        fallback={
          <section className="sec-pad text-center">
            Cargando contacto...
          </section>
        }
      >
        <Contact />
      </Suspense>
    </Layout>
  );
}
