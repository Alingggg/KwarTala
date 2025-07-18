import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./AppRouter.tsx";
import { CurrencyProvider, ModalProvider } from "@/context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CurrencyProvider>
      <ModalProvider>
        <AppRouter />
      </ModalProvider>
    </CurrencyProvider>
  </StrictMode>
);
