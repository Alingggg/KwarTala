import { Navigate, Outlet } from "react-router";
import { useUser } from "@/hooks";
import { AppLoading } from "@/components";

function PublicRoute() {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) return <AppLoading />;

  console.log("PUBLIC isAuthenticated value:", isAuthenticated);

  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
}

export default PublicRoute;
