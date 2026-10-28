import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setupApiInterceptor } from "@/api";
import { CurrencyProvider, ModalProvider, UserProvider } from "@/context";
import AppRouter from "./AppRouter.tsx";

const queryClient = new QueryClient();
setupApiInterceptor(queryClient);

function App() {
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
