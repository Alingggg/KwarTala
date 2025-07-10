import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router";

function DashboardLayout() {
  return (
    <div>
      <Outlet />
      <Sidebar />
    </div>
  );
}

export default DashboardLayout;
