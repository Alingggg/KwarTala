import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useApiInterceptor } from "@/hooks";
import { CurrencyProvider, ModalProvider } from "@/context";
import AppRouter from "./AppRouter.tsx";

const queryClient = new QueryClient();

function App() {
  useApiInterceptor(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <ModalProvider>
          <AppRouter />
        </ModalProvider>
      </CurrencyProvider>
    </QueryClientProvider>
  );
}

export default App;
