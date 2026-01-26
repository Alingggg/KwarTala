import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useApiInterceptor } from "@/hooks";
import { CurrencyProvider, ModalProvider, UserProvider } from "@/context";
import AppRouter from "./AppRouter.tsx";

const queryClient = new QueryClient();

function App() {
  useApiInterceptor(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <CurrencyProvider>
          <ModalProvider>
            <AppRouter />
          </ModalProvider>
        </CurrencyProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
