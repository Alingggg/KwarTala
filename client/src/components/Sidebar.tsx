import {
  FiHome,
  TfiWallet,
  FiBarChart2,
  FiTarget,
  FiLogOut,
  FiMenu,
  FiX,
} from "@/assets/icons";
import type { ReactNode } from "react";
import { NavLink } from "react-router";
import { useState } from "react";
import { useLogout } from "@/hooks";
import { AppLogo } from "@/assets/images";

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

const NavItem = ({ to, icon, label, onClick }: NavItemProps) => (
  <NavLink
    to={to}
    end
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
        isActive
          ? "bg-timberwolf-800 text-night-500"
          : "text-ash-gray-500 hover:bg-night-600 hover:text-timberwolf-900"
      }`
    }
  >
    {icon}
    <span className="ml-4">{label}</span>
  </NavLink>
);

function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { mutate: logout } = useLogout();

  const navItems = [
    { to: "/home", icon: <FiHome />, label: "Home" },
    { to: "/transactions", icon: <TfiWallet />, label: "Transactions" },
    { to: "/analytics", icon: <FiBarChart2 />, label: "Analytics" },
    { to: "/goals", icon: <FiTarget />, label: "Goals" },
  ];

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-night-500 text-timberwolf-500 flex-col p-6">
        <div className="flex items-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mr-4">
            <img
              src={AppLogo}
              alt="KwarTala Logo"
              className="w-16 h-16 rounded-full"
            />
          </div>
          <span className="text-xl font-semibold">KwarTala</span>
        </div>

        <div className="bg-night-600 p-4 rounded-lg mb-8">
          <p className="text-xs text-ash-gray-400 uppercase tracking-wide">
            Today
          </p>
          <p className="text-sm font-medium text-timberwolf-900 mt-1">
            {currentDate}
          </p>
        </div>

        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </nav>
        <div className="mt-auto">
          <button
            type="button"
            onClick={() => logout()}
            className="flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-colors text-ash-gray-500 hover:bg-night-600 hover:text-timberwolf-900 w-full"
          >
            <FiLogOut />
            <span className="ml-4">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <div className="md:hidden bg-night-500 text-timberwolf-500 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-night-600 transition-colors mr-3"
            >
              <FiMenu size={24} />
            </button>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mr-3">
              <img
                src={AppLogo}
                alt="KwarTala Logo"
                className="w-12 h-12 rounded-full"
              />
            </div>
            <span className="text-lg font-semibold">KwarTala</span>
          </div>

          <div className="text-right">
            <p className="text-xs text-ash-gray-400 uppercase tracking-wide">
              Today
            </p>
            <p className="text-sm font-medium text-timberwolf-900">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Side Drawer */}
      {isMenuOpen && (
        <>
          {/* Backdrop - subtle overlay */}
          <div
            className="md:hidden fixed inset-0 bg-black/60 z-40"
            onClick={closeMenu}
          />

          {/* Side Drawer - Reduced width */}
          <div className="md:hidden fixed top-0 left-0 h-full w-72 max-w-[75vw] bg-night-500 text-timberwolf-500 z-50 transform translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl">
            <div className="flex flex-col h-full p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mr-4">
                    <img
                      src={AppLogo}
                      alt="KwarTala Logo"
                      className="w-13 h-13 rounded-full"
                    />
                  </div>
                  <span className="text-xl font-semibold">KwarTala</span>
                </div>
                <button
                  onClick={closeMenu}
                  className="p-2 rounded-lg hover:bg-night-600 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Date Info */}
              <div className="bg-night-600 p-4 rounded-lg mb-8">
                <p className="text-xs text-ash-gray-400 uppercase tracking-wide">
                  Today
                </p>
                <p className="text-sm font-medium text-timberwolf-900 mt-1">
                  {currentDate}
                </p>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col space-y-2 flex-1">
                {navItems.map((item) => (
                  <NavItem key={item.label} {...item} onClick={closeMenu} />
                ))}
              </nav>
              <div className="mt-auto">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-colors text-ash-gray-500 hover:bg-night-600 hover:text-timberwolf-900 w-full"
                >
                  <FiLogOut />
                  <span className="ml-4">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Sidebar;
