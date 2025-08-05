import { Button, Input, LoadingOverlay } from "@/components";
import { FiMail, FiLock, FiAlertCircle } from "@/assets/icons";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useLogin } from "@/hooks";
import { AppLogo } from "@/assets/images";
import { useState } from "react";

interface FormValues {
  email: string;
  password: string;
}

const validation = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Invalid email format",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters",
    },
    maxLength: {
      value: 64,
      message: "Password must be under 64 characters",
    },
    pattern: {
      value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).+$/,
      message: "Must include upper & lowercase letters, a number, and a symbol",
    },
  },
};

function Login() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { mutate: login, isPending } = useLogin();

  function onSubmit(data: FormValues) {
    setError(null);
    login(data, {
      onError: (err: any) => {
        setError(
          err?.response?.data?.message ||
            "Internal server error. Please try again."
        );
      },
    });
  }

  return (
    <div className="min-h-screen bg-timberwolf-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto mb-3 flex items-center justify-center">
            <img
              src={AppLogo}
              alt="KwarTala Logo"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-night-600 mb-1">
            KwarTala
          </h1>
          <p className="text-night-500 text-sm">
            Manage your finances with ease
          </p>
        </div>

        <div className="relative bg-ash-gray-900 rounded-xl shadow-2xl p-6 md:p-7">
          <div className="mb-5">
            <h2 className="text-xl md:text-2xl font-bold text-night-600 mb-1">
              Sign In
            </h2>
            <p className="text-night-500 text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          {error && (
            <div className="mb-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-auburn-800 border border-auburn-800">
                <FiAlertCircle className="w-5 h-5 text-auburn-100" />
                <span className="text-base text-auburn-100 font-semibold">
                  {error}
                </span>
              </div>
            </div>
          )}

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-night-600"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FiMail className="h-4 w-4 text-night-500" />
                </div>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  className={`pl-10 ${
                    errors.email
                      ? "border-auburn-600 focus:border-auburn-600"
                      : ""
                  }`}
                  {...register("email", validation.email)}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-auburn-600 font-semibold">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-night-600"
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
                  className={`pl-10 ${
                    errors.password
                      ? "border-auburn-600 focus:border-auburn-600"
                      : ""
                  }`}
                  {...register("password", validation.password)}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-auburn-600 font-semibold">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full text-sm md:text-base font-semibold py-2.5 md:py-3"
              variant="primary"
              disabled={isPending}
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
          {isPending && <LoadingOverlay message="Signing in..." />}
        </div>
      </div>
    </div>
  );
}

export default Login;
