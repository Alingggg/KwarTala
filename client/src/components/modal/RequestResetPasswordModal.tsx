import { Button, Input, LoadingOverlay } from "@/components";
import { FiX, FiMail, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useGetVerificationEmail } from "@/hooks";

interface RequestResetPasswordModalPropsProps {
  onClose: () => void;
}

const validation = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Invalid email format",
    },
  },
};

function RequestResetPasswordModalProps({
  onClose,
}: RequestResetPasswordModalPropsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();
  const [error, setError] = useState<string | null>(null);
  const {
    mutate: sendVerification,
    isPending,
    isSuccess,
  } = useGetVerificationEmail();

  function onSubmit({ email }: { email: string }) {
    setError(null);
    sendVerification(
      { email, type: "reset-password" },
      {
        onError: (err: any) => {
          setError(
            err?.response?.data?.message ||
              "Internal server error. Please try again."
          );
        },
      }
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6 md:p-8">
      <div className="bg-ash-gray-900 p-5 md:p-7 rounded-lg w-full max-w-sm md:max-w-md text-night-500 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-night-700 hover:text-night-500 z-10"
          disabled={isPending}
        >
          <FiX size={18} className="md:w-5 md:h-5" />
        </button>
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center text-center pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4 bg-emerald-800 border border-emerald-800">
              <FiCheckCircle className="w-5 h-5 text-emerald-100" />
              <span className="text-base text-emerald-100 font-semibold">
                Reset link sent!
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-night-600 mb-2">
              Check your email
            </h2>
            <p className="text-night-500 text-sm mb-2">
              We've sent a password reset link to your email. Please check your
              inbox and follow the instructions to reset your password.
            </p>
            <Button
              onClick={onClose}
              className="w-full text-sm md:text-base font-semibold py-2.5 md:py-3 mt-4"
              variant="primary"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-lg md:text-xl font-bold mb-5 md:mb-6 pr-8">
              Reset Password
            </h2>
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
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-2 md:space-y-3"
              noValidate
              autoComplete="off"
            >
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="text-xs md:text-sm font-semibold text-night-600"
                >
                  Enter your account email{" "}
                  <span className="text-auburn-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <FiMail className="h-4 w-4 text-night-500" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. user@email.com"
                    {...register("email", validation.email)}
                    className={`pl-10 ${
                      errors.email
                        ? "border-auburn-600 focus:border-auburn-600"
                        : ""
                    }`}
                    disabled={isPending}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-auburn-600 font-semibold">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                variant="success"
                className="w-full text-xs md:text-sm px-3 py-2 mt-2"
                disabled={isPending}
              >
                Send Reset Link
              </Button>
            </form>
          </>
        )}
        {isPending && <LoadingOverlay message="Sending reset link..." />}
      </div>
    </div>
  );
}

export default RequestResetPasswordModalProps;
