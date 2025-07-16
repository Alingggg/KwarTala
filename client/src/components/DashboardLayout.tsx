import { Sidebar } from "@/components";
import { Outlet } from "react-router";

function DashboardLayout() {
  return (
    <div className="flex h-screen bg-timberwolf-800 text-night-500">
      <Sidebar />
      <main className="flex-1 overflow-y-auto no-scrollbar-arrows">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
