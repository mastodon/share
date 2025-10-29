import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IntlProvider } from "react-intl";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store";
import messages from "../lang/en.json";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IntlProvider locale="en" messages={messages}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <App />
        </Provider>
      </QueryClientProvider>
    </IntlProvider>
  </StrictMode>,
);
