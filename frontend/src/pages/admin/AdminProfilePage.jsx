import { Phone, Save, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { getProfile, updateProfile } from "../../services/authService";
import { useAppState } from "../../store/AppStateContext";

function AdminProfilePage() {
  const { updateAdminProfile } = useAppState();
  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    email: "",
    username: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const profile = await getProfile();
        if (!isMounted) {
          return;
        }
        setForm({
          full_name: profile.full_name || "",
          phone_number: profile.phone_number || "",
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          email: profile.email || "",
          username: profile.username || ""
        });
        updateAdminProfile(profile);
      } catch (_error) {
        toast.error("Unable to load studio profile.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [updateAdminProfile]);

  const updateField = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  };

  if (isLoading) {
    return (
      <section className="glass-panel">
        <Loader label="Loading photographer profile..." />
      </section>
    );
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
      <div className="glass-panel">
        <p className="pill">Studio Profile</p>
        <h1 className="mt-4 text-3xl font-semibold text-[var(--text)]">Manage the photographer account that receives event SMS updates.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Keep the phone number current here so every new event code and password-reset OTP goes to the right photographer device.
        </p>

        <form
          className="mt-8 grid gap-5 sm:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();

            try {
              setIsSaving(true);
              const profile = await updateProfile({
                full_name: form.full_name,
                phone_number: form.phone_number,
                first_name: form.first_name,
                last_name: form.last_name
              });
              updateAdminProfile(profile);
              setForm((current) => ({
                ...current,
                full_name: profile.full_name || "",
                phone_number: profile.phone_number || "",
                first_name: profile.first_name || "",
                last_name: profile.last_name || ""
              }));
              toast.success("Studio profile updated");
            } catch (error) {
              const detail =
                error?.response?.data?.phone_number?.[0] ||
                error?.response?.data?.full_name?.[0] ||
                error?.response?.data?.detail ||
                "Unable to update the profile right now.";
              toast.error(detail);
            } finally {
              setIsSaving(false);
            }
          }}
        >
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="profile-full-name">
              Studio / Photographer Name
            </label>
            <input
              className="field-input mt-2"
              id="profile-full-name"
              onChange={(event) => updateField("full_name", event.target.value)}
              value={form.full_name}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="profile-phone">
              SMS Phone Number
            </label>
            <input
              className="field-input mt-2"
              id="profile-phone"
              onChange={(event) => updateField("phone_number", event.target.value)}
              placeholder="+919876543210"
              type="tel"
              value={form.phone_number}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="profile-email">
              Login Email
            </label>
            <input
              className="field-input mt-2 opacity-80"
              disabled
              id="profile-email"
              type="email"
              value={form.email}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="profile-first-name">
              First Name
            </label>
            <input
              className="field-input mt-2"
              id="profile-first-name"
              onChange={(event) => updateField("first_name", event.target.value)}
              value={form.first_name}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="profile-last-name">
              Last Name
            </label>
            <input
              className="field-input mt-2"
              id="profile-last-name"
              onChange={(event) => updateField("last_name", event.target.value)}
              value={form.last_name}
            />
          </div>

          <div className="sm:col-span-2">
            <Button disabled={isSaving} type="submit">
              <Save className="mr-2" size={18} />
              {isSaving ? "Saving profile..." : "Save studio settings"}
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <div className="glass-panel">
          <div className="flex items-center gap-3">
            <Phone className="text-[var(--primary)]" size={18} />
            <p className="text-lg font-semibold text-[var(--text)]">SMS behavior</p>
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
            <li>New event codes are sent to this phone number after each event is created.</li>
            <li>Forgot-password OTP codes are also delivered to this same number.</li>
            <li>Use international format like `+919876543210` for the most reliable SMS delivery.</li>
          </ul>
        </div>

        <div className="glass-panel">
          <div className="flex items-center gap-3">
            <UserRound className="text-[var(--primary)]" size={18} />
            <p className="text-lg font-semibold text-[var(--text)]">Current account</p>
          </div>
          <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <p>
              <span className="font-semibold text-[var(--text)]">Username:</span> {form.username}
            </p>
            <p>
              <span className="font-semibold text-[var(--text)]">Email:</span> {form.email}
            </p>
            <p>
              <span className="font-semibold text-[var(--text)]">SMS number:</span> {form.phone_number || "Not set"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminProfilePage;
