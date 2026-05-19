import { useState } from "react";
import { LogIn } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { SectionCard } from "../components/common/SectionCard";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/formatters";


export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const targetPath = location.state?.from?.pathname || "/admin/dashboard";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate(targetPath, { replace: true });
    } catch (submitError) {
      setError(getErrorMessage(submitError, "Unable to sign in."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-xl">
        <SectionCard
          eyebrow="Admin Authentication"
          title="Welcome back to the wedding dashboard"
          subtitle="Use the photographer admin account to create events, generate QR codes, and push wedding images through the face-matching pipeline."
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-stone-700">Email</span>
              <input
                type="email"
                className="input-field"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="admin@example.com"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-stone-700">Password</span>
              <input
                type="password"
                className="input-field"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="Enter your password"
                required
              />
            </label>

            {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

            <button type="submit" className="button-primary w-full gap-2" disabled={loading}>
              <LogIn className="h-4 w-4" />
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}

