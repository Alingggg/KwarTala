import { Navigate, Outlet } from "react-router";
import { useUserContext } from "@/hooks";
import { AppLoading } from "@/components";

function PublicRoute() {
  const { isAuthenticated, isLoading } = useUserContext();

  if (isLoading) return <AppLoading />;

  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
}

export default PublicRoute;
