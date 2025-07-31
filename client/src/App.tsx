import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useApiInterceptor } from "@/hooks";
import { CurrencyProvider, ModalProvider } from "@/context";
import AppRouter from "./AppRouter.tsx";

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  useApiInterceptor(queryClient);

  useEffect(() => {
    // Check if already authenticated in this session
    if (sessionStorage.getItem("dev-authenticated") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (password === "mydevpass123") {
      // Change this to your password
      sessionStorage.setItem("dev-authenticated", "true");
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
      setPassword("");
    }
  };

  // Show password form if not authenticated
  if (!isAuthenticated) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h1>🔒 Private Development</h1>
        <p>This site is temporarily private for testing</p>
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "12px",
              fontSize: "16px",
              border: "2px solid #ddd",
              borderRadius: "4px",
              marginRight: "10px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 20px",
              fontSize: "16px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  // Your existing app
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
