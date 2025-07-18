import { Button, Input } from "@/components";
import { FiUser, FiLock } from "@/assets/icons";
import { useNavigate } from "react-router";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-timberwolf-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-night-600 mx-auto mb-3 flex items-center justify-center">
            <span className="text-xl md:text-2xl font-bold text-timberwolf-900">
              K
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-night-600 mb-1">
            KwarTala
          </h1>
          <p className="text-night-500 text-sm">
            Manage your finances with ease
          </p>
        </div>

        <div className="bg-ash-gray-900 rounded-xl shadow-2xl p-6 md:p-7">
          <div className="mb-5">
            <h2 className="text-xl md:text-2xl font-bold text-night-600 mb-1">
              Sign In
            </h2>
            <p className="text-night-500 text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-night-600 mb-1"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FiUser className="h-4 w-4 text-night-500" />
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-night-600 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FiLock className="h-4 w-4 text-night-500" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full text-sm md:text-base font-semibold py-2.5 md:py-3"
              variant="primary"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-night-500">
              Don't have an account?{" "}
              <button
                className="text-night-600 hover:text-night-700 font-semibold"
                onClick={() => navigate("/register")}
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
