"use client";
// ⚠️ DEPRECATED: Use HeaderGeneric component instead
// Este archivo ahora es un wrapper que usa HeaderGeneric

import HeaderGeneric from "./HeaderGeneric";

interface HeaderAuxProps {
  scroll?: number | boolean;
  isMobileMenu?: boolean;
  handleMobileMenu: () => void;
  isSidebar?: boolean;
}

/**
 * @deprecated Usar HeaderGeneric en /src/components/layout/HeaderGeneric.tsx en su lugar
 * Este componente ahora es simplemente un wrapper del nuevo HeaderGeneric
 * para mantener compatibilidad hacia atras.
 */
export default function HeaderAux(props: HeaderAuxProps): React.ReactElement {
  const normalizedScroll =
    typeof props.scroll === "boolean"
      ? props.scroll
        ? 1
        : 0
      : (props.scroll ?? 0);

  return <HeaderGeneric {...props} scroll={normalizedScroll} variant="aux" />;
}

/* Archivo completamente refactorizado - ver HeaderGeneric.tsx en /src/components/layout */