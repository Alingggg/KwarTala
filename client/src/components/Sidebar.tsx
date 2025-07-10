import {
  FiHome,
  TfiWallet,
  FiBarChart2,
  FiTarget,
  FiLogOut,
} from "@/assets/icons";
import type { ReactNode } from "react";
import { NavLink } from "react-router";

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
        isActive
          ? "bg-ash-gray-700 text-night-500"
          : "text-ash-gray-400 hover:bg-ash-gray-800"
      }`
    }
  >
    {icon}
    <span className="ml-4">{label}</span>
  </NavLink>
);

function Sidebar() {
  const navItems = [
    { to: "/", icon: <FiHome />, label: "Home" },
    { to: "/transactions", icon: <TfiWallet />, label: "Transactions" },
    { to: "/analytics", icon: <FiBarChart2 />, label: "Analytics" },
    { to: "/goals", icon: <FiTarget />, label: "Goals" },
  ];

  return (
    <aside className="w-64 bg-ash-gray-900 text-white flex flex-col p-6">
      <div className="flex items-center mb-12">
        <div className="w-12 h-12 rounded-full bg-night-500 mr-4"></div>
        <span className="text-xl font-semibold">KwarTala</span>
      </div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>
      <div className="mt-auto">
        <button className="flex items-center px-4 py-3 text-lg font-medium text-ash-gray-400 hover:bg-ash-gray-800 rounded-lg w-full">
          <FiLogOut />
          <span className="ml-4">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
