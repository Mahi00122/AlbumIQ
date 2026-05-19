import { CalendarPlus, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import StatCard from "../../components/common/StatCard";
import { listEvents } from "../../services/eventService";
import { formatDate, formatNumber } from "../../utils/formatters";

function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        const data = await listEvents();
        if (isMounted) {
          setEvents(data);
        }
      } catch (_error) {
        toast.error("Unable to load dashboard events.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalEvents = events.length;
    const totalUploads = events.reduce((sum, event) => sum + (event.photo_count || 0), 0);
    const latestEvent = events[0];

    return [
      {
        label: "Total Events",
        value: formatNumber(totalEvents),
        change: totalEvents ? "Synced from backend" : "No events yet"
      },
      {
        label: "Total Uploads",
        value: formatNumber(totalUploads),
        change: totalUploads ? "Photo count from live data" : "No uploads yet"
      },
      {
        label: "Latest Event",
        value: latestEvent?.event_code || "-",
        change: latestEvent ? formatDate(latestEvent.event_date) : "Create your first event"
      },
      {
        label: "Guest Portal",
        value: latestEvent?.guest_portal_url ? "Ready" : "Pending",
        change: latestEvent?.guest_portal_url || "Generated after event creation"
      }
    ];
  }, [events]);

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="pill">Recent weddings</p>
              <h2 className="mt-4 text-2xl font-semibold text-[var(--text)]">Live event overview</h2>
            </div>
            <Link to="/admin/create-event">
              <Button>
                <CalendarPlus className="mr-2" size={18} />
                Create event
              </Button>
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {isLoading ? <Loader label="Loading admin events..." /> : null}

            {!isLoading && !events.length ? (
              <div className="rounded-[24px] border border-dashed border-[rgba(124,61,143,0.16)] bg-white/80 p-6 text-sm leading-6 text-[var(--muted)]">
                No backend events found for this admin yet. Create the first wedding to populate the dashboard.
              </div>
            ) : null}

            {events.map((event) => (
              <article
                key={event.id}
                className="rounded-[24px] border border-[rgba(124,61,143,0.12)] bg-white/85 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text)]">{event.event_name}</h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      Event code {event.event_code} - {formatDate(event.event_date)}
                    </p>
                  </div>
                  <span className="rounded-full bg-[rgba(240,93,151,0.14)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                    {event.photo_count ? "Live" : "New"}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Photos</p>
                    <p className="mt-2 text-xl font-bold text-[var(--text)]">{formatNumber(event.photo_count || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Created</p>
                    <p className="mt-2 text-xl font-bold text-[var(--text)]">{formatDate(event.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Portal</p>
                    <p className="mt-2 text-sm font-bold text-[var(--text)]">
                      {event.guest_portal_url || "Will appear after create"}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="glass-panel">
          <p className="pill">Quick actions</p>
          <h2 className="mt-4 text-2xl font-semibold text-[var(--text)]">Keep the event pipeline moving.</h2>

          <div className="mt-6 space-y-4">
            <Link
              className="block rounded-[24px] border border-[rgba(124,61,143,0.12)] bg-white/85 p-5 transition hover:-translate-y-0.5"
              to="/admin/create-event"
            >
              <p className="text-lg font-semibold text-[var(--text)]">Create a new wedding event</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Generate the event code, QR workflow, and guest-ready access from the backend.
              </p>
            </Link>

            <Link
              className="block rounded-[24px] border border-[rgba(124,61,143,0.12)] bg-white/85 p-5 transition hover:-translate-y-0.5"
              to="/admin/upload-photos"
            >
              <p className="text-lg font-semibold text-[var(--text)]">Upload event photo batches</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Stage large wedding albums and read processing state from the backend upload queue.
              </p>
            </Link>

            <div className="rounded-[24px] bg-[linear-gradient(135deg,#7c3d8f,#f05d97)] p-6 text-white shadow-[0_24px_55px_rgba(124,61,143,0.28)]">
              <UploadCloud size={22} />
              <p className="mt-4 text-2xl font-semibold">Admin dashboard is now reading live backend event data.</p>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Create events and upload flows can now continue from this connected base.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
