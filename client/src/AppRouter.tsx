import { BrowserRouter, Route, Routes } from "react-router";
import {
  Analytics,
  EditEmail,
  EmailVerification,
  Goals,
  Home,
  Login,
  Register,
  ResetPassword,
  Settings,
  Transactions,
} from "@/pages";
import { DashboardLayout, ProtectedRoute, PublicRoute } from "@/components";
import { useEffect } from "react";
import { useLocation } from "react-router";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const el = document.querySelector("main");
    el?.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            {/* <Route path="/goals" element={<Goals />} /> */}
          </Route>
        </Route>
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-email" element={<EditEmail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
