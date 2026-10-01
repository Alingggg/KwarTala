import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useVerifyEmail } from "@/hooks";
import { Button, LoadingSpinner } from "@/components";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

export default function EmailVerification() {
  const [hasToken, setHasToken] = useState(false);
  const navigate = useNavigate();
  const { mutate: verifyEmail, isPending, isError, error } = useVerifyEmail();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const newEmail = urlParams.get("newEmail");

    if (token) {
      setHasToken(true);
      if (newEmail) {
        verifyEmail({ token, newEmail });
      } else {
        verifyEmail({ token });
      }
    }
  }, [verifyEmail, setHasToken]);

  if (!hasToken) {
    return (
      <div className="min-h-screen bg-timberwolf-800 flex items-center justify-center p-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-auburn-900 border border-auburn-900">
          <FiAlertCircle className="w-5 h-5 text-auburn-500" />
          <span className="text-base text-auburn-100 font-semibold">
            Invalid verification link
          </span>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-timberwolf-800 flex items-center justify-center p-4">
        <LoadingSpinner message="Verifying your email..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-timberwolf-800 flex items-center justify-center p-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-auburn-900 border border-auburn-900">
          <FiAlertCircle className="w-5 h-5 text-auburn-500" />
          <span className="text-base text-auburn-100 font-semibold">
            {error?.response?.data?.message ||
              "Email verification failed. Please try again."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-timberwolf-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-timberwolf-900 rounded-xl shadow-2xl p-6 md:p-7 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4">
              <FiCheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-base text-night-500 font-semibold">
                Email verified successfully!
              </span>
            </div>
            <p className="text-night-500 text-sm">
              Your email has been verified. You can now sign in to your account.
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
