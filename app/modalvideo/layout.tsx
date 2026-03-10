import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Video",
  description:
    "Video demostrativo de soluciones y aplicaciones de autonivelante en Chile.",
  alternates: {
    canonical: "/modalvideo",
  },
};

export default function ModalVideoLayout({ children }: { children: ReactNode }) {
  return children;
}
