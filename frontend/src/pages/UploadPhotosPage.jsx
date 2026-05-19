import { LoaderCircle, Upload } from "lucide-react";
import { useState } from "react";

import { FileDropzone } from "../components/common/FileDropzone";
import { SectionCard } from "../components/common/SectionCard";
import { useUploadStatus } from "../hooks/useUploadStatus";
import { uploadPhotos } from "../services/photoService";
import { getErrorMessage } from "../utils/formatters";


export default function UploadPhotosPage() {
  const [eventCode, setEventCode] = useState("");
  const [files, setFiles] = useState([]);
  const [eventId, setEventId] = useState("");
  const [queuedCount, setQueuedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { status, error: statusError } = useUploadStatus(eventId, Boolean(eventId));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await uploadPhotos({ eventCode, files });
      setEventId(response.event_id);
      setQueuedCount(response.queued);
      setFiles([]);
    } catch (submitError) {
      setError(getErrorMessage(submitError, "Unable to upload photos."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <SectionCard
        eyebrow="Bulk Upload"
        title="Push wedding photos into the AI pipeline"
        subtitle="Each upload is queued for background processing so the dashboard stays responsive while embeddings are generated."
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-stone-700">Event code</span>
            <input
              className="input-field"
              value={eventCode}
              onChange={(event) => setEventCode(event.target.value.toUpperCase())}
              placeholder="WED-AX12"
              required
            />
          </label>

          <FileDropzone
            files={files}
            onFilesChange={setFiles}
            label="Drop all wedding images for this event"
          />

          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <button type="submit" className="button-primary gap-2" disabled={loading || !files.length}>
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {loading ? "Uploading..." : "Queue Upload"}
          </button>
        </form>
      </SectionCard>

      <SectionCard
        eyebrow="Processing Status"
        title="Track background extraction"
        subtitle="Celery workers can pick up the uploaded images and start creating face embeddings immediately."
      >
        {queuedCount ? (
          <div className="mb-4 rounded-[24px] border border-amber-200 bg-amber-50/90 px-4 py-4 text-sm text-amber-900">
            {queuedCount} photos were queued for processing. Live status will keep refreshing below.
          </div>
        ) : null}

        {statusError ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{statusError}</p> : null}

        {status ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-4">
                <p className="eyebrow">Event Code</p>
                <p className="mt-2 text-lg font-semibold">{status.event_code}</p>
              </div>
              <div className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-4">
                <p className="eyebrow">Total Images</p>
                <p className="mt-2 text-lg font-semibold">{status.total}</p>
              </div>
              <div className="rounded-[24px] border border-stone-200 bg-stone-50/80 p-4">
                <p className="eyebrow">Completed</p>
                <p className="mt-2 text-lg font-semibold">{status.status_breakdown?.completed || 0}</p>
              </div>
            </div>

            <div className="space-y-3">
              {status.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="flex items-center justify-between rounded-[22px] border border-stone-200 bg-white/80 px-4 py-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-stone-800">{photo.original_filename || "Uploaded image"}</p>
                    <p className="text-stone-500">{photo.processing_status}</p>
                  </div>
                  {photo.image_url ? (
                    <a href={photo.image_url} target="_blank" rel="noreferrer" className="button-secondary px-4 py-2 text-xs">
                      Preview
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-stone-300 bg-stone-50/70 px-5 py-8 text-sm text-stone-600">
            Upload a batch to start polling the Celery processing status.
          </div>
        )}
      </SectionCard>
    </div>
  );
}

