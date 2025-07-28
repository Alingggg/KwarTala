import { CurrencyContext } from "@/context";
import { useContext } from "react";

function useCurrencyContext() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error(
      "useCurrencyContext must be used within a CurrencyProvider"
    );
  }
  return context;
}

export default useCurrencyContext;
