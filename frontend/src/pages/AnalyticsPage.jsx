import { Activity, Camera, SearchCode } from "lucide-react";
import { useEffect, useState } from "react";

import { SectionCard } from "../components/common/SectionCard";
import { StatCard } from "../components/common/StatCard";
import { getEvents } from "../services/eventService";
import { getErrorMessage } from "../utils/formatters";


export default function AnalyticsPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadEvents = async () => {
      try {
        const response = await getEvents();
        if (!cancelled) {
          setEvents(Array.isArray(response) ? response : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getErrorMessage(loadError, "Unable to load analytics input."));
        }
      }
    };

    loadEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPhotos = events.reduce((sum, event) => sum + (event.photo_count || 0), 0);
  const derivedAnalytics = {
    totalPhotos,
    averagePhotos: events.length ? Math.round(totalPhotos / events.length) : 0,
    qrReadyRate: events.length
      ? Math.round((events.filter((event) => Boolean(event.qr_url)).length / events.length) * 100)
      : 0
  };

  return (
    <div className="space-y-6">
      <SectionCard
        eyebrow="Operational Analytics"
        title="Current admin-side visibility"
        subtitle="This starter dashboard derives useful signals from event data today and leaves room for guest-search analytics endpoints next."
      >
        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Photos Across Events" value={derivedAnalytics.totalPhotos} detail="Total wedding frames registered in the system." />
          <StatCard label="Average Album Size" value={derivedAnalytics.averagePhotos} detail="Useful for planning worker concurrency and queue load." />
          <StatCard label="QR Ready Rate" value={`${derivedAnalytics.qrReadyRate}%`} detail="Shareable event experiences already prepared for guests." />
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Next Analytics Slice"
        title="Recommended API additions"
        subtitle="The UI is prepared for deeper event intelligence once guest search telemetry is exposed from the backend."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-5">
            <SearchCode className="h-6 w-6 text-[var(--c-accent)]" />
            <h3 className="mt-4 text-lg font-semibold">Guest Search Volume</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">Count searches per event, per hour, and per guest segment after launch.</p>
          </div>
          <div className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-5">
            <Activity className="h-6 w-6 text-[var(--c-olive)]" />
            <h3 className="mt-4 text-lg font-semibold">Match Success Rate</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">Track how often selfies produce at least one confident face match.</p>
          </div>
          <div className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-5">
            <Camera className="h-6 w-6 text-[var(--c-gold)]" />
            <h3 className="mt-4 text-lg font-semibold">Processing Throughput</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">Measure average image processing time and worker backlog trends.</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
