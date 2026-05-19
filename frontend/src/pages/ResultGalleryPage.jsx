import { ArrowLeft, Images, Sparkles } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

import { MatchCard } from "../components/common/MatchCard";
import { SectionCard } from "../components/common/SectionCard";


export default function ResultGalleryPage() {
  const { eventCode } = useParams();
  const location = useLocation();
  const results = location.state?.results || [];
  const event = location.state?.event;
  const matchedCount = location.state?.matchedCount ?? results.length;

  return (
    <SectionCard
      eyebrow="Result Gallery"
      title={event?.event_name ? `${event.event_name} matches` : "Your matched wedding gallery"}
      subtitle="The strongest face matches appear first so guests can immediately browse and download their memories."
      actions={
        <Link to={`/event/${eventCode}`} className="button-secondary gap-2">
          <ArrowLeft className="h-4 w-4" />
          Search again
        </Link>
      }
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="tag-pill">
          <Sparkles className="h-3.5 w-3.5" />
          {matchedCount} matches found
        </span>
        <span className="tag-pill">
          <Images className="h-3.5 w-3.5" />
          Event {eventCode}
        </span>
      </div>

      {results.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((match) => (
            <MatchCard key={`${match.photo_id}-${match.similarity}`} imageUrl={match.image_url} similarity={match.similarity} />
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-stone-300 bg-stone-50/70 px-5 py-10 text-sm leading-6 text-stone-600">
          No matches are available in memory right now. If you refreshed the page, run the selfie search again so the client can repopulate the gallery from the latest API response.
        </div>
      )}
    </SectionCard>
  );
}

