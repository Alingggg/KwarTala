import { useLogout, useModalContext, useUser } from "@/hooks";
import { Button } from "@/components";
import { FiUser, FiMail, FiLogOut } from "react-icons/fi";

function Settings() {
  const { userName, email } = useUser();
  const { mutate: logout } = useLogout();
  const { openModal } = useModalContext();

  return (
    <div className="p-3 md:p-8 flex flex-col h-full">
      {/* Page Header */}
      <div className="mb-5 md:mb-8 mt-1 md:mt-0">
        <h1 className="text-xl md:text-3xl font-bold text-night-600">
          Settings
        </h1>
      </div>

      <div className="flex-1 w-full mx-auto">
        {/* Profile Information */}
        <div className="mb-8">
          <h2 className="text-lg md:text-xl font-bold text-night-600 mb-4 flex items-center gap-2">
            <FiUser className="w-5 h-5 md:w-6 md:h-6 text-night-600" />
            Profile Information
          </h2>
          <div className="divide-y divide-ash-gray-200">
            {/* Username */}
            <div className="py-4 flex flex-row items-center justify-between gap-2 md:gap-4">
              <div className="flex-1">
                <label className="flex items-center gap-2 text-sm font-medium text-night-700 mb-1">
                  <FiUser className="w-4 h-4" />
                  Username
                </label>
                <div className="text-base md:text-lg font-semibold text-night-600 break-all">
                  {userName}
                </div>
              </div>
              <Button
                variant="secondary"
                className="text-xs md:text-sm px-4 py-2 w-auto"
                onClick={() =>
                  openModal("EDIT_USERNAME", { currentUsername: userName })
                }
              >
                Edit
              </Button>
            </div>
            {/* Email */}
            <div className="py-4 flex flex-row items-center justify-between gap-2 md:gap-4">
              <div className="flex-1">
                <label className="flex items-center gap-2 text-sm font-medium text-night-700 mb-1">
                  <FiMail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="text-base md:text-lg font-semibold text-night-600 break-all">
                  {email}
                </div>
              </div>
              <Button
                variant="secondary"
                className="text-xs md:text-sm px-4 py-2 w-auto"
                onClick={() =>
                  openModal("REQUEST_EDIT_EMAIL", { currentEmail: email })
                }
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button at the very end of the page */}
      <div className="mt-auto pt-8 flex justify-end w-full">
        <Button
          onClick={logout}
          className="flex items-center justify-center gap-2 text-sm md:text-base px-6 py-3 w-full"
        >
          <FiLogOut className="w-4 h-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}

export default Settings;
