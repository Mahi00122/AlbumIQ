import { ArrowLeft, KeyRound, MessageSquareMore, MoveRight } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/common/Button";
import { requestPasswordReset, resetPassword } from "../../services/authService";

function AdminForgotPasswordPage() {
  const navigate = useNavigate();
  const [requestForm, setRequestForm] = useState({
    email: ""
  });
  const [resetForm, setResetForm] = useState({
    email: "",
    otp_code: "",
    new_password: "",
    confirm_password: ""
  });
  const [step, setStep] = useState(1);
  const [deliveryHint, setDeliveryHint] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleRequestCode = async (event) => {
    event.preventDefault();

    try {
      setIsSending(true);
      const payload = await requestPasswordReset(requestForm);
      setDeliveryHint(payload.phone_hint || "");
      setResetForm((current) => ({
        ...current,
        email: requestForm.email,
        otp_code: payload.debug_code || current.otp_code
      }));
      setStep(2);
      toast.success(payload.message || "Reset code processed.");
      if (payload.delivery_detail) {
        toast(payload.delivery_detail);
      }
      if (payload.debug_code) {
        toast.success(`Development OTP: ${payload.debug_code}`);
      }
    } catch (error) {
      const detail =
        error?.response?.data?.email?.[0] ||
        error?.response?.data?.detail ||
        "Unable to process the reset request right now.";
      toast.error(detail);
    } finally {
      setIsSending(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    try {
      setIsResetting(true);
      const payload = await resetPassword(resetForm);
      toast.success(payload.message || "Password updated successfully.");
      navigate("/admin/login");
    } catch (error) {
      const detail =
        error?.response?.data?.confirm_password?.[0] ||
        error?.response?.data?.new_password?.[0] ||
        error?.response?.data?.detail ||
        "Unable to reset password right now.";
      toast.error(detail);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <section className="page-shell flex min-h-screen items-center justify-center">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="glass-panel hidden lg:block">
          <p className="pill">Photographer Recovery</p>
          <h1 className="hero-heading mt-8">Reset your dashboard password using an SMS code sent to the photographer number on file.</h1>
          <p className="subtle-copy mt-6 max-w-xl">
            This flow uses the same phone number you manage in Studio Profile, so password recovery stays inside the product instead of relying on Django admin.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Step 1: request a one-time SMS code with your email",
              "Step 2: enter the OTP and choose a new password",
              "Step 3: sign back into the photographer dashboard"
            ].map((item) => (
              <div key={item} className="rounded-[24px] border border-white/50 bg-white/75 px-5 py-4 text-sm font-semibold text-[var(--text)]">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel">
          <div className="mx-auto max-w-md">
            <Link className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]" to="/">
              <ArrowLeft size={16} />
              Back to Home
            </Link>

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-white">
              {step === 1 ? <MessageSquareMore size={24} /> : <KeyRound size={24} />}
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">
              {step === 1 ? "Forgot Password" : "Reset Password"}
            </p>
            <h2 className="mt-4 text-4xl font-semibold text-[var(--text)]">
              {step === 1 ? "Request your SMS reset code." : "Enter the OTP and choose a new password."}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {step === 1
                ? "Use the photographer account email. If a phone number is saved for that account, an SMS reset code will be issued."
                : `Reset code destination: ${deliveryHint || "the photographer phone on file"}.`}
            </p>

            {step === 1 ? (
              <form className="mt-8 space-y-5" onSubmit={handleRequestCode}>
                <div>
                  <label className="field-label" htmlFor="forgot-email">
                    Photographer Email
                  </label>
                  <input
                    className="field-input mt-2"
                    id="forgot-email"
                    onChange={(event) => setRequestForm({ email: event.target.value })}
                    type="email"
                    value={requestForm.email}
                  />
                </div>

                <Button className="w-full" disabled={isSending} type="submit">
                  {isSending ? "Sending code..." : "Send SMS code"}
                  <MoveRight className="ml-2" size={18} />
                </Button>
              </form>
            ) : (
              <form className="mt-8 space-y-5" onSubmit={handleResetPassword}>
                <div>
                  <label className="field-label" htmlFor="reset-email">
                    Photographer Email
                  </label>
                  <input
                    className="field-input mt-2"
                    id="reset-email"
                    onChange={(event) => setResetForm((current) => ({ ...current, email: event.target.value }))}
                    type="email"
                    value={resetForm.email}
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="reset-otp">
                    OTP Code
                  </label>
                  <input
                    className="field-input mt-2"
                    id="reset-otp"
                    maxLength={6}
                    onChange={(event) => setResetForm((current) => ({ ...current, otp_code: event.target.value.replace(/\D/g, "") }))}
                    placeholder="6-digit code"
                    type="text"
                    value={resetForm.otp_code}
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="reset-new-password">
                    New Password
                  </label>
                  <input
                    className="field-input mt-2"
                    id="reset-new-password"
                    minLength={8}
                    onChange={(event) => setResetForm((current) => ({ ...current, new_password: event.target.value }))}
                    type="password"
                    value={resetForm.new_password}
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="reset-confirm-password">
                    Confirm Password
                  </label>
                  <input
                    className="field-input mt-2"
                    id="reset-confirm-password"
                    minLength={8}
                    onChange={(event) => setResetForm((current) => ({ ...current, confirm_password: event.target.value }))}
                    type="password"
                    value={resetForm.confirm_password}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button className="flex-1" disabled={isResetting} type="submit">
                    {isResetting ? "Resetting password..." : "Update password"}
                    <MoveRight className="ml-2" size={18} />
                  </Button>
                  <Button
                    disabled={isResetting}
                    onClick={() => setStep(1)}
                    type="button"
                    variant="secondary"
                  >
                    Request new code
                  </Button>
                </div>
              </form>
            )}

            <p className="mt-5 text-sm text-[var(--muted)]">
              Remembered it?{" "}
              <Link className="font-semibold text-[var(--primary)]" to="/admin/login">
                Back to login
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminForgotPasswordPage;
