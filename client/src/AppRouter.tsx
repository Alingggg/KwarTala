import { BrowserRouter, Route, Routes } from "react-router";
import { Analytics, Home, Transactions } from "@/pages";
import { DashboardLayout } from "@/components";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
