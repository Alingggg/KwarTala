import { Navigate, Outlet } from "react-router";
import { useUser } from "@/hooks";
import { AppLoading } from "@/components";

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) return <AppLoading />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
