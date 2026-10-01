import { Button, LoadingOverlay } from "@/components";
import { FiX, FiCheckCircle, FiAlertCircle, FiMail } from "react-icons/fi";
import { useState } from "react";
import { useGetVerificationEmail } from "@/hooks";

interface RequestEditEmailModalProps {
  onClose: () => void;
  currentEmail: string;
}

function RequestEditEmailModal({
  onClose,
  currentEmail,
}: RequestEditEmailModalProps) {
  const [error, setError] = useState<string | null>(null);
  const {
    mutate: sendVerificationEmail,
    isPending,
    isSuccess,
  } = useGetVerificationEmail();

  function handleSend() {
    setError(null);
    sendVerificationEmail(
      { email: currentEmail, type: "change-email" },
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
                Change email link sent!
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-night-600 mb-2">
              Check your email
            </h2>
            <p className="text-night-500 text-sm mb-2">
              We've sent a link to change your email to{" "}
              <span className="font-semibold">{currentEmail}</span>. Please
              check your inbox and follow the instructions.
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
              Change Email
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
            <div className="flex flex-col gap-4 items-center">
              <FiMail className="w-8 h-8 text-night-500 mb-2" />
              <p className="text-night-500 text-sm mb-2">
                Send a change email link to{" "}
                <span className="font-semibold">{currentEmail}</span>?
              </p>
              <Button
                type="button"
                variant="success"
                className="w-full text-xs md:text-sm px-3 py-2 mt-2"
                disabled={isPending}
                onClick={handleSend}
              >
                Send Change Email Link
              </Button>
            </div>
          </>
        )}
        {isPending && <LoadingOverlay message="Sending change email link..." />}
      </div>
    </div>
  );
}

export default RequestEditEmailModal;
