import { Button, Input, LoadingOverlay } from "@/components";
import { FiUser, FiLock, FiMail, FiAlertCircle } from "@/assets/icons";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useRegister } from "@/hooks";
import { AppLogo } from "@/assets/images";
import { useState } from "react";

interface FormValues {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validation = {
  userName: {
    required: "Username is required",
    minLength: {
      value: 3,
      message: "Must be at least 3 characters",
    },
    maxLength: {
      value: 20,
      message: "Must be 20 characters or below",
    },
    pattern: {
      value: /^[A-Za-z0-9]+$/,
      message: "Only letters and numbers allowed",
    },
  },
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
      message: "Password must be 64 characters or below",
    },
    pattern: {
      value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).+$/,
      message: "Must include upper & lowercase letters, a number, and a symbol",
    },
  },
};

function Register() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>();
  const { mutate: registerUser, isPending } = useRegister();

  const password = watch("password");

  function onSubmit(data: FormValues) {
    setError(null);
    registerUser(data, {
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
              Create Account
            </h2>
            <p className="text-night-500 text-sm">Sign up to get started</p>
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
                htmlFor="userName"
                className="block text-sm font-semibold text-night-600"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FiUser className="h-4 w-4 text-night-500" />
                </div>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Enter your username"
                  className={`pl-10 ${
                    errors.userName
                      ? "border-auburn-600 focus:border-auburn-600"
                      : ""
                  }`}
                  {...register("userName", validation.userName)}
                />
              </div>
              {errors.userName && (
                <p className="text-xs text-auburn-600 font-semibold">
                  {errors.userName.message}
                </p>
              )}
            </div>

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
                  type="email"
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

            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-night-600"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FiLock className="h-4 w-4 text-night-500" />
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className={`pl-10 ${
                    errors.confirmPassword
                      ? "border-auburn-600 focus:border-auburn-600"
                      : ""
                  }`}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-auburn-600 font-semibold">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full text-sm md:text-base font-semibold py-2.5 md:py-3"
              variant="primary"
              disabled={isPending}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-night-500">
              Already have an account?{" "}
              <button
                className="text-night-600 hover:text-night-700 font-semibold"
                onClick={() => navigate("/login")}
              >
                Sign in here
              </button>
            </p>
          </div>
          {isPending && <LoadingOverlay message="Creating account..." />}
        </div>
      </div>
    </div>
  );
}

export default Register;
