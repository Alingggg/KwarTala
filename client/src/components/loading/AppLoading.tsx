import { AppLogo } from "@/assets/images";
import { LoadingSpinner } from "@/components";

function AppLoading() {
  return (
    <div className="min-h-screen bg-timberwolf-800 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-32 h-32 md:w-36 md:h-36 rounded-full mx-auto mb-6 flex items-center justify-center">
          <img
            src={AppLogo}
            alt="KwarTala Logo"
            className="w-28 h-28 md:w-32 md:h-32 rounded-full"
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-night-600 mb-2">
          KwarTala
        </h1>
        <p className="text-night-500 text-base mb-8">
          Manage your finances with ease
        </p>
        <LoadingSpinner message="Loading..." />
      </div>
    </div>
  );
}

export default AppLoading;
