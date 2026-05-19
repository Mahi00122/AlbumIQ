import { CalendarRange, Camera, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { SectionCard } from "../components/common/SectionCard";
import { StatCard } from "../components/common/StatCard";
import { getEvents } from "../services/eventService";
import { formatDate, getErrorMessage } from "../utils/formatters";


export default function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadEvents = async () => {
      try {
        const response = await getEvents();
        if (!cancelled) {
          setEvents(Array.isArray(response) ? response : []);
          setError("");
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getErrorMessage(loadError, "Unable to load events."));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPhotos = events.reduce((sum, event) => sum + (event.photo_count || 0), 0);
  const stats = {
    totalEvents: events.length,
    totalPhotos,
    liveCodes: events.filter((event) => event.event_code).length
  };

  return (
    <div className="space-y-6">
      <SectionCard
        eyebrow="Overview"
        title="Wedding operations at a glance"
        subtitle="Track event setup, image volume, and QR readiness before guests begin searching."
        actions={
          <Link to="/admin/events/new" className="button-primary">
            Create New Event
          </Link>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Events Created" value={stats.totalEvents} detail="Wedding albums currently managed by your team." />
          <StatCard label="Photos Registered" value={stats.totalPhotos} detail="Uploaded frames waiting to be processed or already searchable." />
          <StatCard label="Live Event Codes" value={stats.liveCodes} detail="Events with guest entry and QR distribution ready." />
        </div>
      </SectionCard>

      <SectionCard eyebrow="Recent Events" title="Active wedding collection" subtitle="Each event includes the generated code and quick upload status context.">
        {loading ? <p className="text-sm text-stone-600">Loading events...</p> : null}
        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        {!loading && !error ? (
          events.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {events.map((event) => (
                <article key={event.id} className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="tag-pill">
                      <Sparkles className="h-3.5 w-3.5" />
                      {event.event_code}
                    </span>
                    <span className="tag-pill">
                      <CalendarRange className="h-3.5 w-3.5" />
                      {formatDate(event.event_date)}
                    </span>
                    <span className="tag-pill">
                      <Camera className="h-3.5 w-3.5" />
                      {event.photo_count || 0} photos
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{event.event_name}</h3>
                  <p className="mt-2 text-sm text-stone-600">Guest portal: {event.guest_portal_url}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link to="/admin/uploads" className="button-secondary">
                      Upload More Photos
                    </Link>
                    {event.qr_url ? (
                      <a href={event.qr_url} target="_blank" rel="noreferrer" className="button-primary">
                        View QR
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-stone-300 bg-white/60 px-5 py-8 text-sm text-stone-600">
              No events yet. Start with the event creation flow and generate the first QR code for guests.
            </div>
          )
        ) : null}
      </SectionCard>
    </div>
  );
}
