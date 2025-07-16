import { useState, createContext, type ReactNode } from "react";

interface CurrencyContextType {
  currency: string | null;
  setCurrency: (currency: string | null) => void;
}
type CurrencyType = string | null;

const DEFAULT_CURRENCY: CurrencyType = "₱";

export const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyType>(DEFAULT_CURRENCY);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}
