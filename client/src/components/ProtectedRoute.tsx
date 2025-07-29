import { Navigate, Outlet } from "react-router";
import { useUser } from "@/hooks";

function ProtectedRoute() {
  const { isAuthenticated } = useUser();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
