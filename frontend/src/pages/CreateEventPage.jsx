import { CalendarDays, Copy, QrCode } from "lucide-react";
import { useState } from "react";

import { SectionCard } from "../components/common/SectionCard";
import { createEvent } from "../services/eventService";
import { formatDate, getErrorMessage } from "../utils/formatters";


export default function CreateEventPage() {
  const [form, setForm] = useState({ event_name: "", event_date: "" });
  const [createdEvent, setCreatedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await createEvent(form);
      setCreatedEvent(response);
    } catch (submitError) {
      setError(getErrorMessage(submitError, "Unable to create event."));
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (!createdEvent?.event_code) {
      return;
    }

    await navigator.clipboard.writeText(createdEvent.event_code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <SectionCard
        eyebrow="New Wedding"
        title="Create an event and generate the guest QR"
        subtitle="This flow creates the wedding, issues a unique event code, and stores a QR image that guests can scan directly."
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-stone-700">Event name</span>
            <input
              className="input-field"
              value={form.event_name}
              onChange={(event) => setForm((current) => ({ ...current, event_name: event.target.value }))}
              placeholder="Rahul & Ananya Wedding"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-stone-700">Event date</span>
            <input
              type="date"
              className="input-field"
              value={form.event_date}
              onChange={(event) => setForm((current) => ({ ...current, event_date: event.target.value }))}
              required
            />
          </label>

          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <button type="submit" className="button-primary gap-2" disabled={loading}>
            <CalendarDays className="h-4 w-4" />
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </SectionCard>

      <SectionCard
        eyebrow="Generated Assets"
        title={createdEvent ? createdEvent.event_name : "Event QR Preview"}
        subtitle="After creation, share the QR image or the event code with wedding guests for instant access."
      >
        {createdEvent ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="tag-pill">
                <QrCode className="h-3.5 w-3.5" />
                {createdEvent.event_code}
              </span>
              <span className="tag-pill">{formatDate(createdEvent.event_date)}</span>
            </div>

            <div className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-5">
              <p className="text-sm font-medium text-stone-700">Guest portal</p>
              <p className="mt-2 break-all text-sm text-stone-600">{createdEvent.guest_portal_url}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" className="button-secondary gap-2" onClick={copyCode}>
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied" : "Copy event code"}
                </button>
                {createdEvent.qr_url ? (
                  <a href={createdEvent.qr_url} target="_blank" rel="noreferrer" className="button-primary">
                    Open QR image
                  </a>
                ) : null}
              </div>
            </div>

            {createdEvent.qr_url ? (
              <div className="overflow-hidden rounded-[24px] border border-stone-200 bg-white p-4">
                <img src={createdEvent.qr_url} alt="Generated event QR code" className="mx-auto max-h-[320px] rounded-[20px]" />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex h-full min-h-[280px] items-center justify-center rounded-[24px] border border-dashed border-stone-300 bg-stone-50/70 p-6 text-center text-sm leading-6 text-stone-600">
            Create a wedding event to see the generated code and QR asset here.
          </div>
        )}
      </SectionCard>
    </div>
  );
}

