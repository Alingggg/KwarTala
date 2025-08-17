import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Input, LoadingOverlay } from "@/components";
import { FiAlertCircle, FiCheckCircle, FiMail } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useGetVerificationEmail } from "@/hooks";
import * as z from "zod";
import { changeEmailSchema } from "@/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";

type FormValues = z.infer<typeof changeEmailSchema>;

function EditEmail() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [oldEmail, setOldEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(changeEmailSchema) });

  const {
    mutate: sendVerificationEmail,
    isPending,
    isSuccess,
    isError,
    error,
  } = useGetVerificationEmail();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("token");
    const oldEmail = urlParams.get("oldEmail");

    if (accessToken) {
      setToken(accessToken);
    }
    if (oldEmail) {
      setOldEmail(oldEmail);
    }
  }, [setToken]);

  function onSubmit(data: FormValues) {
    sendVerificationEmail({
      email: oldEmail as string,
      type: "register",
      newEmail: data.newEmail,
    });
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-timberwolf-800 flex items-center justify-center p-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-auburn-800 border border-auburn-800">
          <FiAlertCircle className="w-5 h-5 text-auburn-100" />
          <span className="text-base text-auburn-100 font-semibold">
            Invalid or expired change email link
          </span>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-timberwolf-800 flex items-center justify-center p-4">
        <div className="bg-ash-gray-900 rounded-xl shadow-2xl p-6 md:p-7 text-center max-w-md w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4 bg-emerald-800 border border-emerald-800">
            <FiCheckCircle className="w-5 h-5 text-emerald-100" />
            <span className="text-base text-emerald-100 font-semibold">
              Verification link sent!
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-night-600 mb-2">
            Check your email
          </h2>
          <p className="text-night-500 text-sm mb-6">
            We've sent a verification link to your new email address. Please
            check your inbox and follow the instructions to complete changing
            your email.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="w-full text-sm md:text-base font-semibold py-2.5 md:py-3"
            variant="primary"
          >
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-timberwolf-800 flex items-center justify-center p-4">
      <div className="bg-ash-gray-900 rounded-xl shadow-2xl p-6 md:p-7 text-center max-w-md w-full">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-night-600 mb-2">
            Change Your Email
          </h2>
          <p className="text-night-500 text-sm">Enter your new email</p>
        </div>
        {isError && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-2 bg-auburn-800 border border-auburn-800 justify-center">
            <FiAlertCircle className="w-5 h-5 text-auburn-100" />
            <span className="text-base text-auburn-100 font-semibold">
              {error?.response?.data?.message ||
                "Request email change failed. Please try again."}
            </span>
          </div>
        )}
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          autoComplete="off"
        >
          <div className="flex flex-col gap-1 text-left">
            <label
              htmlFor="newEmail"
              className="block text-sm font-semibold text-night-600"
            >
              New Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <FiMail className="h-4 w-4 text-night-500" />
              </div>
              <Input
                id="newEmail"
                type="email"
                placeholder="Enter new email"
                className={`pl-10 ${
                  errors.newEmail
                    ? "border-auburn-600 focus:border-auburn-600"
                    : ""
                }`}
                {...register("newEmail")}
              />
            </div>
            {errors.newEmail && (
              <p className="text-xs text-auburn-600 font-semibold">
                {errors.newEmail.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <label
              htmlFor="confirmEmail"
              className="block text-sm font-semibold text-night-600"
            >
              Confirm New Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <FiMail className="h-4 w-4 text-night-500" />
              </div>
              <Input
                id="confirmEmail"
                type="email"
                placeholder="Confirm new email"
                className={`pl-10 ${
                  errors.confirmEmail
                    ? "border-auburn-600 focus:border-auburn-600"
                    : ""
                }`}
                {...register("confirmEmail")}
              />
            </div>
            {errors.confirmEmail && (
              <p className="text-xs text-auburn-600 font-semibold">
                {errors.confirmEmail.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full text-sm md:text-base font-semibold py-2.5 md:py-3"
            variant="success"
          >
            Change Email
          </Button>
        </form>
        {isPending && <LoadingOverlay message="Changing your email..." />}
      </div>
    </div>
  );
}

export default EditEmail;
