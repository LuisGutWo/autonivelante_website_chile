import type { Metadata } from "next";
import Layout from '../../src/components/layout/Layout';
import Contact from '../../src/components/layout/Contact';
import ContactGoogleMap from '../../src/components/layout/ContactGoogleMap';
import StructuredData, {
  createLocalBusinessSchema,
  createBreadcrumbSchema,
} from '../../src/components/common/StructuredData';

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta a Autonivelante Chile para cotizaciones, asesoría técnica y ejecución de proyectos de pisos autonivelantes.",
  alternates: {
    canonical: "/contact-page",
  },
};

export default function ContactPage() {
  const breadcrumbItems = [
    { name: "Inicio", url: "https://autonivelante.cl" },
    { name: "Contacto", url: "https://autonivelante.cl/contact-page" },
  ];

  return (
    <Layout headerStyle={2} footerStyle={1}>
      <StructuredData data={createLocalBusinessSchema()} />
      <StructuredData data={createBreadcrumbSchema(breadcrumbItems)} />
      <div>
        <Contact />
        <ContactGoogleMap />
      </div>
    </Layout>
  );
}
