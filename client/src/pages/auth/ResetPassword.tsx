import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Input, LoadingOverlay } from "@/components";
import { FiAlertCircle, FiCheckCircle, FiLock } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useResetPassword } from "@/hooks";
import * as z from "zod";
import { resetPasswordSchema } from "@/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";

type FormValues = z.infer<typeof resetPasswordSchema>;

function ResetPassword() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(resetPasswordSchema) });

  const {
    mutate: resetPassword,
    isPending,
    isSuccess,
    isError,
    error,
  } = useResetPassword();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("token");

    if (accessToken) {
      setToken(accessToken);
    }
  }, [setToken]);

  function onSubmit(data: FormValues) {
    resetPassword({ token: token as string, newPassword: data.password });
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-timberwolf-800 flex items-center justify-center p-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-auburn-900 border border-auburn-900">
          <FiAlertCircle className="w-5 h-5 text-auburn-500" />
          <span className="text-base text-auburn-100 font-semibold">
            Invalid or expired reset link
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-timberwolf-800 flex items-center justify-center p-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-auburn-900 border border-auburn-900">
          <FiAlertCircle className="w-5 h-5 text-auburn-500" />
          <span className="text-base text-auburn-100 font-semibold">
            {(error as any)?.response?.data?.message ||
              "Password reset failed. Please try again."}
          </span>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-timberwolf-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-timberwolf-900 rounded-xl shadow-2xl p-6 md:p-7 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4">
                <FiCheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-base text-night-500 font-semibold">
                  Password reset successfully!
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-night-600 mb-2">
                You can now sign in
              </h2>
              <p className="text-night-500 text-sm">
                Your password has been updated. Please use your new password to
                sign in.
              </p>
            </div>
            <Button
              onClick={() => navigate("/login")}
              className="w-full text-sm md:text-base font-semibold py-2.5 md:py-3"
              variant="primary"
            >
              Go to Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-timberwolf-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-timberwolf-900 rounded-xl shadow-2xl p-6 md:p-7 text-center">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-night-600 mb-2">
              Reset Your Password
            </h2>
            <p className="text-night-500 text-sm">Enter your new password</p>
          </div>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete="off"
          >
            <div className="flex flex-col gap-1 text-left">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-night-600"
              >
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FiLock className="h-4 w-4 text-night-500" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  className={`pl-10 ${
                    errors.password
                      ? "border-auburn-600 focus:border-auburn-600"
                      : ""
                  }`}
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-auburn-600 font-semibold">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-night-600"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FiLock className="h-4 w-4 text-night-500" />
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className={`pl-10 ${
                    errors.confirmPassword
                      ? "border-auburn-600 focus:border-auburn-600"
                      : ""
                  }`}
                  {...register("confirmPassword")}
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
              variant="success"
            >
              Reset Password
            </Button>
          </form>
        </div>
      </div>
      {isPending && <LoadingOverlay message="Resetting your password..." />}
    </div>
  );
}

export default ResetPassword;
