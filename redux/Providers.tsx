"use client";
import React from "react";
import { store } from "./store";
import { Provider } from "react-redux";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps): React.ReactElement {
  return <Provider store={store}>{children}</Provider>;
}
