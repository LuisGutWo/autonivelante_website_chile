import type { Metadata } from "next";
import type { ReactNode } from "react";
import StructuredData, {
  createBreadcrumbSchema,
} from "../../src/components/common/StructuredData";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Conoce proyectos ejecutados por Autonivelante Chile en superficies residenciales, comerciales e industriales.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  const breadcrumbItems = [
    { name: "Inicio", url: "https://autonivelante.cl" },
    { name: "Proyectos", url: "https://autonivelante.cl/projects" },
  ];

  return (
    <>
      <StructuredData data={createBreadcrumbSchema(breadcrumbItems)} />
      {children}
    </>
  );
}
