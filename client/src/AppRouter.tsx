import { BrowserRouter, Route, Routes } from "react-router";
import { Analytics, Goals, Home, Transactions } from "@/pages";
import { DashboardLayout } from "@/components";
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
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="goals" element={<Goals />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
