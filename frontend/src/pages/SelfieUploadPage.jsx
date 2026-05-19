import { LoaderCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { FileDropzone } from "../components/common/FileDropzone";
import { SectionCard } from "../components/common/SectionCard";
import { getEventByCode } from "../services/eventService";
import { searchPhotos } from "../services/searchService";
import { formatDate, getErrorMessage } from "../utils/formatters";


export default function SelfieUploadPage() {
  const { eventCode } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [files, setFiles] = useState([]);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadEvent = async () => {
      try {
        const response = await getEventByCode(eventCode);
        if (!cancelled) {
          setEventData(response);
          setError("");
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getErrorMessage(loadError, "Unable to find this event."));
        }
      } finally {
        if (!cancelled) {
          setLoadingEvent(false);
        }
      }
    };

    loadEvent();
    return () => {
      cancelled = true;
    };
  }, [eventCode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!files[0]) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await searchPhotos({ eventCode, selfie: files[0] });
      navigate(`/event/${eventCode}/results`, {
        state: {
          event: eventData,
          results: response.matched_images,
          matchedCount: response.matched_count
        }
      });
    } catch (submitError) {
      setError(getErrorMessage(submitError, "Unable to search photos right now."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <SectionCard
        eyebrow="Event Details"
        title={loadingEvent ? "Loading event..." : eventData?.event_name || "Wedding Event"}
        subtitle="Confirm the event before uploading a selfie for face matching."
      >
        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        {eventData ? (
          <div className="space-y-4">
            <span className="tag-pill">{eventData.event_code}</span>
            <div className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-5">
              <p className="text-sm font-medium text-stone-700">Wedding date</p>
              <p className="mt-2 text-lg font-semibold">{formatDate(eventData.event_date)}</p>
            </div>
            <p className="text-sm leading-6 text-stone-600">
              Upload a clear front-facing selfie. The backend will generate a face embedding and compare it against all processed wedding photos for this event.
            </p>
          </div>
        ) : null}
      </SectionCard>

      <SectionCard
        eyebrow="Selfie Upload"
        title="Find your wedding gallery"
        subtitle="One selfie is enough to start matching across the full event collection."
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <FileDropzone
            files={files}
            onFilesChange={setFiles}
            multiple={false}
            label="Drop a clear selfie or tap to choose one"
          />

          <button type="submit" className="button-primary gap-2" disabled={!files.length || submitting || loadingEvent}>
            {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {submitting ? "Searching..." : "Find My Photos"}
          </button>
        </form>
      </SectionCard>
    </div>
  );
}

