import { Button, Input, LoadingOverlay } from "@/components";
import { FiX, FiUser, FiCheckCircle, FiAlertCircle } from "@/assets/icons";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useEditUsername } from "@/hooks";

interface EditUsernameModalProps {
  onClose: () => void;
  currentUsername?: string;
}

const validation = {
  userName: {
    required: "Username is required",
    minLength: {
      value: 3,
      message: "Username must be at least 3 characters",
    },
    maxLength: {
      value: 20,
      message: "Username must be at most 20 characters",
    },
    pattern: {
      value: /^[a-zA-Z0-9_]+$/,
      message: "Username can only contain letters, numbers, and underscores",
    },
  },
};

function EditUsernameModal({
  onClose,
  currentUsername,
}: EditUsernameModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<{ userName: string }>({
    defaultValues: { userName: currentUsername || "" },
  });
  const [error, setError] = useState<string | null>(null);
  const [initialUsername, setInitialUsername] = useState<string | null>(
    currentUsername ?? null
  );
  const { mutate: editUsername, isPending, isSuccess } = useEditUsername();

  function onSubmit({ userName }: { userName: string }) {
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
                  htmlFor="username"
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
                    {...register("userName", validation.userName)}
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
