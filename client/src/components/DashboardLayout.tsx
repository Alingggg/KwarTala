import { Sidebar } from "@/components";
import { Outlet } from "react-router";

function DashboardLayout() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-timberwolf-800 text-night-500">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
