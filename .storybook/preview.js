/** @type { import('@storybook/react').Preview } */
import "../public/assets/css/bootstrap.css";
import "../public/assets/css/style.css";
import "../public/assets/css/color.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "../redux/store";

// Crear QueryClient para Storybook
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: false, // Desactivar retry en Storybook
    },
  },
});

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#1a1a1a",
        },
        {
          name: "autonivelante-blue",
          value: "#015c93",
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <div style={{ padding: "1rem" }}>
            <Story />
          </div>
        </QueryClientProvider>
      </Provider>
    ),
  ],
};

export default preview;
