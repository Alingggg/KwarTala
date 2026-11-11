import { Button, Input, LoadingOverlay } from "@/components";
import { FiX, FiUser, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useEditUsername } from "@/hooks";
import * as z from "zod";
import { userNameSchema } from "@/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";

const formObjectSchema = z.object({ userName: userNameSchema });
type FormValues = z.infer<typeof formObjectSchema>;

interface EditUsernameModalProps {
  onClose: () => void;
  currentUsername?: string;
}

function EditUsernameModal({
  onClose,
  currentUsername,
}: EditUsernameModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formObjectSchema),
    defaultValues: { userName: currentUsername || "" },
  });
  const [error, setError] = useState<string | null>(null);
  const [initialUsername, setInitialUsername] = useState<string | null>(
    currentUsername ?? null
  );
  const { mutate: editUsername, isPending, isSuccess } = useEditUsername();

  function onSubmit({ userName }: FormValues) {
    setError(null);
    editUsername(userName, {
      onError: (err: any) => {
        setError(
          err?.response?.data?.message ||
            "Internal server error. Please try again."
        );
      },
    });
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6 md:p-8">
      <div className="bg-timberwolf-900 p-5 md:p-7 rounded-lg w-full max-w-sm md:max-w-md text-night-500 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-night-700 hover:text-night-500 z-10 cursor-pointer"
          disabled={isPending}
        >
          <FiX size={18} className="md:w-5 md:h-5" />
        </button>
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center text-center pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4 bg-emerald-900 border border-emerald-900">
              <FiCheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-base text-night-500 font-semibold">
                Username updated!
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-night-600 mb-2">
              Success
            </h2>
            <p className="text-night-500 text-sm mb-2">
              Your username has been changed successfully.
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
              Edit Username
            </h2>
            {error && (
              <div className="mb-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-auburn-900 border border-auburn-900">
                  <FiAlertCircle className="w-5 h-5 text-auburn-500" />
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
                  htmlFor="userName"
                  className="text-xs md:text-sm font-semibold text-night-600"
                >
                  Username <span className="text-auburn-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <FiUser className="h-4 w-4 text-night-500" />
                  </div>
                  <Input
                    id="userName"
                    type="text"
                    placeholder="Enter new username"
                    {...register("userName")}
                    className={`pl-10 ${
                      errors.userName
                        ? "border-auburn-600 focus:border-auburn-600"
                        : ""
                    }`}
                    disabled={isPending}
                  />
                </div>
                {errors.userName && (
                  <p className="text-xs text-auburn-600 font-semibold">
                    {errors.userName.message}
                  </p>
                )}
              </div>
              {initialUsername !== watch("userName") && (
                <Button
                  type="submit"
                  variant="success"
                  className="w-full text-xs md:text-sm px-3 py-2 mt-2"
                  disabled={isPending}
                >
                  Save Username
                </Button>
              )}
            </form>
          </>
        )}
        {isPending && <LoadingOverlay message="Saving username..." />}
      </div>
    </div>
  );
}

export default EditUsernameModal;
