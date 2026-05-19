import { Copy, ExternalLink, QrCode, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

import Button from "../../components/common/Button";
import { createEvent } from "../../services/eventService";
import { useAppState } from "../../store/AppStateContext";
import { formatDate } from "../../utils/formatters";

function CreateEventPage() {
  const { setSelectedAdminEventId } = useAppState();
  const [form, setForm] = useState({
    coupleName: "Aarav & Siya",
    date: "2026-12-12",
    venue: "Jaipur Palace",
    welcomeMessage: "Scan to find your photos instantly"
  });
  const [createdEvent, setCreatedEvent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const shareableEvent = createdEvent || null;

  const copyEventCode = async () => {
    if (!shareableEvent?.event_code) {
      toast.error("Create an event first to copy the code.");
      return;
    }

    await navigator.clipboard.writeText(shareableEvent.event_code);
    toast.success(`Copied ${shareableEvent.event_code}`);
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
      <div className="glass-panel">
        <p className="pill">Create wedding</p>
        <h1 className="mt-4 text-3xl font-semibold text-[var(--text)]">Generate the guest access experience for a new event.</h1>

        <form
          className="mt-8 grid gap-5 sm:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();

            try {
              setIsSaving(true);
              const payload = await createEvent({
                event_name: form.coupleName,
                event_date: form.date
              });
              setCreatedEvent(payload);
              setSelectedAdminEventId(payload.id);
              if (payload.sms_notification?.sent) {
                toast.success(`Event ${payload.event_code} created and SMS sent`);
              } else {
                toast.success(`Event ${payload.event_code} created successfully`);
                if (payload.sms_notification?.detail) {
                  toast(payload.sms_notification.detail);
                }
              }
            } catch (error) {
              const detail =
                error?.response?.data?.detail ||
                error?.response?.data?.event_name?.[0] ||
                "Unable to create the event right now.";
              toast.error(detail);
            } finally {
              setIsSaving(false);
            }
          }}
        >
          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="couple-name">
              Couple or event title
            </label>
            <input
              className="field-input mt-2"
              id="couple-name"
              onChange={(event) => setForm((current) => ({ ...current, coupleName: event.target.value }))}
              value={form.coupleName}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="event-date">
              Event date
            </label>
            <input
              className="field-input mt-2"
              id="event-date"
              onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
              type="date"
              value={form.date}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="event-venue">
              Venue
            </label>
            <input
              className="field-input mt-2"
              id="event-venue"
              onChange={(event) => setForm((current) => ({ ...current, venue: event.target.value }))}
              value={form.venue}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="field-label" htmlFor="event-message">
              Guest welcome message
            </label>
            <textarea
              className="field-input mt-2 min-h-28 resize-none"
              id="event-message"
              onChange={(event) => setForm((current) => ({ ...current, welcomeMessage: event.target.value }))}
              value={form.welcomeMessage}
            />
          </div>

          <div className="sm:col-span-2">
            <Button disabled={isSaving} type="submit">
              {isSaving ? "Creating event..." : "Create backend event"}
            </Button>
          </div>
        </form>
      </div>

      <div className="glass-panel">
        <p className="pill">Guest preview</p>
        <h2 className="mt-4 text-2xl font-semibold text-[var(--text)]">{form.coupleName}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {form.venue} - {formatDate(form.date)}
        </p>

        <div className="mt-8 rounded-[28px] bg-[linear-gradient(135deg,#7c3d8f,#f05d97)] p-6 text-white shadow-[0_24px_55px_rgba(124,61,143,0.28)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/80">Event code</p>
              <p className="mt-3 text-3xl font-bold">{shareableEvent?.event_code || "Generated after save"}</p>
            </div>
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[24px] bg-white text-[var(--primary)]">
              {shareableEvent?.qr_url ? (
                <img
                  alt={`${shareableEvent.event_code} QR code`}
                  className="h-full w-full object-cover"
                  src={shareableEvent.qr_url}
                />
              ) : (
                <QrCode size={40} />
              )}
            </div>
          </div>
          <p className="mt-6 text-sm leading-6 text-white/85">{form.welcomeMessage}</p>
          {shareableEvent?.guest_portal_url ? (
            <p className="mt-4 text-sm leading-6 text-white/85">
              Guest portal: {shareableEvent.guest_portal_url}
            </p>
          ) : null}
          {shareableEvent?.sms_notification ? (
            <p className="mt-3 text-sm leading-6 text-white/85">
              SMS status: {shareableEvent.sms_notification.sent ? "Sent" : shareableEvent.sms_notification.status}. {shareableEvent.sms_notification.detail}
            </p>
          ) : null}
          {shareableEvent ? (
            <div className="mt-5 flex flex-wrap gap-3">
              <Button className="bg-white text-[var(--primary)] hover:bg-white/90" onClick={copyEventCode} type="button">
                <Copy className="mr-2" size={16} />
                Copy event code
              </Button>
              {shareableEvent.qr_url ? (
                <a
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  href={shareableEvent.qr_url}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ExternalLink className="mr-2" size={16} />
                  Open QR image
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-6 rounded-[24px] border border-[rgba(124,61,143,0.12)] bg-white/85 p-5">
          <div className="flex items-center gap-3">
            <Sparkles className="text-[var(--primary)]" size={18} />
            <p className="font-semibold text-[var(--text)]">Current backend scope</p>
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
            <li>Event title and event date are saved to the backend now.</li>
            <li>Event code, guest portal URL, and QR asset are generated by the backend.</li>
            <li>The backend attempts to text the event code to the photographer phone number on file.</li>
            <li>Venue and welcome message are still frontend-only preview fields.</li>
            <li>Real SMS delivery needs Twilio environment variables configured on the backend.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default CreateEventPage;
