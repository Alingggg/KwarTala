import { Navigate, Outlet } from "react-router";
import { useCheckHasToReLogIn, useLogout, useUserContext } from "@/hooks";
import { AppLoading } from "@/components";
import { useEffect } from "react";

function ProtectedRoute() {
  const { isAuthenticated, isLoading: isUserLoading } = useUserContext();
  const { hasToReLogIn, isLoading: isReLoginLoading } =
    useCheckHasToReLogIn(isAuthenticated);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  useEffect(() => {
    if (isAuthenticated && hasToReLogIn) {
      logout();
    }
  }, [isAuthenticated, hasToReLogIn, logout]);

  if (isUserLoading || isLoggingOut || isReLoginLoading) return <AppLoading />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
