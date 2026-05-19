import { ArrowLeft, Camera, MoveRight } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/common/Button";
import { registerPhotographer } from "../../services/authService";
import { useAppState } from "../../store/AppStateContext";

function AdminRegisterPage() {
  const navigate = useNavigate();
  const { loginAdmin } = useAppState();
  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      const session = await registerPhotographer(form);
      loginAdmin(session);
      toast.success("Photographer account created");
      navigate("/admin/dashboard");
    } catch (error) {
      const data = error?.response?.data || {};
      const detail =
        data.confirm_password?.[0] ||
        data.email?.[0] ||
        data.password?.[0] ||
        data.non_field_errors?.[0] ||
        data.detail ||
        data.message ||
        "Unable to create your account right now.";
      toast.error(detail);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-shell flex min-h-screen items-center justify-center">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="glass-panel hidden lg:block">
          <p className="pill">Photographer Onboarding</p>
          <h1 className="hero-heading mt-8">Create your studio account and start launching wedding galleries yourself.</h1>
          <p className="subtle-copy mt-6 max-w-xl">
            New photographers can now register directly from the product instead of waiting for manual Django admin user creation.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Create your own dashboard login in seconds",
              "Set up separate wedding events under your account",
              "Upload and manage only your own client galleries"
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
              <Camera size={24} />
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">
              Photographer Registration
            </p>
            <h2 className="mt-4 text-4xl font-semibold text-[var(--text)]">Create your FindMyShaadi Pics studio account.</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Register once, then you can create events, upload wedding albums, and manage guest search access without touching Django admin.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="field-label" htmlFor="photographer-name">
                  Full Name
                </label>
                <input
                  className="field-input mt-2"
                  id="photographer-name"
                  onChange={(event) => updateField("full_name", event.target.value)}
                  placeholder="Krish Verma Photography"
                  type="text"
                  value={form.full_name}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="photographer-phone">
                  Phone Number
                </label>
                <input
                  className="field-input mt-2"
                  id="photographer-phone"
                  onChange={(event) => updateField("phone_number", event.target.value)}
                  placeholder="+919876543210"
                  type="tel"
                  value={form.phone_number}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="photographer-email">
                  Email
                </label>
                <input
                  className="field-input mt-2"
                  id="photographer-email"
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="studio@example.com"
                  type="email"
                  value={form.email}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="photographer-password">
                  Password
                </label>
                <input
                  className="field-input mt-2"
                  id="photographer-password"
                  minLength={8}
                  onChange={(event) => updateField("password", event.target.value)}
                  placeholder="Minimum 8 characters"
                  type="password"
                  value={form.password}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="photographer-confirm-password">
                  Confirm Password
                </label>
                <input
                  className="field-input mt-2"
                  id="photographer-confirm-password"
                  minLength={8}
                  onChange={(event) => updateField("confirm_password", event.target.value)}
                  placeholder="Re-enter your password"
                  type="password"
                  value={form.confirm_password}
                />
              </div>

              <Button className="w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Creating account..." : "Create photographer account"}
                <MoveRight className="ml-2" size={18} />
              </Button>
            </form>

            <p className="mt-5 text-sm text-[var(--muted)]">
              Already have a studio account?{" "}
              <Link className="font-semibold text-[var(--primary)]" to="/admin/login">
                Sign in here
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminRegisterPage;
