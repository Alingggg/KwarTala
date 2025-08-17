import { Navigate, Outlet } from "react-router";
import { useCheckHasToReLogIn, useLogout, useUser } from "@/hooks";
import { AppLoading } from "@/components";
import { useEffect } from "react";

function ProtectedRoute() {
  const { isAuthenticated, isLoading: isUserLoading } = useUser();
  const { hasToReLogIn } = useCheckHasToReLogIn(isUserLoading);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  useEffect(() => {
    if (isAuthenticated && hasToReLogIn) {
      logout();
    }
  }, [isAuthenticated, hasToReLogIn, logout]);

  if (isUserLoading || isLoggingOut) return <AppLoading />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
