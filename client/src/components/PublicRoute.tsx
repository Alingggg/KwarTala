import { Navigate, Outlet } from "react-router";
import { useUser } from "@/hooks";

function PublicRoute() {
  const { isAuthenticated } = useUser();

  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
}

export default PublicRoute;
