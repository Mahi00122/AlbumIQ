import { CheckCircle2, Copy, ExternalLink, FolderUp, TimerReset } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";

import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import SelfieDropzone from "../../components/guest/SelfieDropzone";
import { listEvents } from "../../services/eventService";
import { getUploadStatus, uploadPhotos } from "../../services/photoService";
import { useAppState } from "../../store/AppStateContext";
import { formatDate, formatStatusLabel } from "../../utils/formatters";

function UploadPhotosPage() {
  const { selectedAdminEventId, setSelectedAdminEventId } = useAppState();
  const [events, setEvents] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [statusData, setStatusData] = useState(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedAdminEventId) || events[0] || null,
    [events, selectedAdminEventId]
  );

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        const data = await listEvents();
        if (!isMounted) {
          return;
        }

        setEvents(data);
        if (!selectedAdminEventId && data[0]?.id) {
          setSelectedAdminEventId(data[0].id);
        }
      } catch (_error) {
        toast.error("Unable to load events for photo upload.");
      } finally {
        if (isMounted) {
          setIsLoadingEvents(false);
        }
      }
    }

    loadEvents();
    return () => {
      isMounted = false;
    };
  }, [selectedAdminEventId, setSelectedAdminEventId]);

  useEffect(() => {
    let isMounted = true;

    async function loadStatus() {
      if (!selectedEvent?.id) {
        setStatusData(null);
        return;
      }

      try {
        setIsLoadingStatus(true);
        const data = await getUploadStatus(selectedEvent.id);
        if (isMounted) {
          setStatusData(data);
        }
      } catch (_error) {
        if (isMounted) {
          setStatusData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingStatus(false);
        }
      }
    }

    loadStatus();
    return () => {
      isMounted = false;
    };
  }, [selectedEvent]);

  const statusBreakdown = Object.entries(statusData?.status_breakdown || {});

  const copySelectedEventCode = async () => {
    if (!selectedEvent?.event_code) {
      toast.error("Select an event first.");
      return;
    }

    await navigator.clipboard.writeText(selectedEvent.event_code);
    toast.success(`Copied ${selectedEvent.event_code}`);
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <div className="glass-panel">
        <p className="pill">Upload workflow</p>
        <h1 className="mt-4 text-3xl font-semibold text-[var(--text)]">
          Upload photos for one selected wedding at a time.
        </h1>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          The admin selects a specific wedding first, then each batch is posted to the backend with that event code.
        </p>

        <div className="mt-8 grid gap-4">
          <div className="rounded-[26px] border border-[rgba(124,61,143,0.12)] bg-white/85 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">
              Select wedding
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {events.map((event) => {
                const isActive = event.id === selectedEvent?.id;

                return (
                  <button
                    key={event.id}
                    className={`rounded-[22px] border p-4 text-left transition ${
                      isActive
                        ? "border-[var(--primary)] bg-[rgba(124,61,143,0.08)] shadow-[0_18px_35px_rgba(124,61,143,0.16)]"
                        : "border-[rgba(124,61,143,0.12)] bg-white hover:border-[rgba(124,61,143,0.24)]"
                    }`}
                    onClick={() => setSelectedAdminEventId(event.id)}
                    type="button"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-lg font-semibold text-[var(--text)]">{event.event_name}</p>
                      {isActive ? <CheckCircle2 className="text-[var(--primary)]" size={18} /> : null}
                    </div>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                      {event.event_code}
                    </p>
                    <p className="mt-3 text-sm text-[var(--muted)]">{formatDate(event.event_date)}</p>
                  </button>
                );
              })}
            </div>
            {isLoadingEvents ? (
              <div className="mt-4">
                <Loader label="Loading weddings..." />
              </div>
            ) : null}
            {!isLoadingEvents && !events.length ? (
              <div className="mt-4 rounded-[22px] border border-dashed border-[rgba(124,61,143,0.16)] bg-white/80 p-5 text-sm leading-6 text-[var(--muted)]">
                No events are available yet. Create a wedding first, then come back here to upload photos.
              </div>
            ) : null}
          </div>

          <div className="rounded-[26px] bg-[linear-gradient(135deg,#7c3d8f,#f05d97)] p-5 text-white shadow-[0_24px_55px_rgba(124,61,143,0.28)]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">Current upload target</p>
                <h2 className="mt-3 text-2xl font-semibold">{selectedEvent?.event_name || "Select a wedding"}</h2>
                <p className="mt-2 text-sm text-white/80">
                  Event code {selectedEvent?.event_code || "-"} - {selectedEvent ? formatDate(selectedEvent.event_date) : "No date"}
                </p>
                <p className="mt-4 text-sm leading-6 text-white/85">
                  Any photos uploaded here belong only to this wedding. The backend stores and tracks them per event.
                </p>
                {selectedEvent ? (
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button
                      className="bg-white text-[var(--primary)] hover:bg-white/90"
                      onClick={copySelectedEventCode}
                      type="button"
                    >
                      <Copy className="mr-2" size={16} />
                      Copy event code
                    </Button>
                    {selectedEvent.qr_url ? (
                      <a
                        className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                        href={selectedEvent.qr_url}
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

              <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-[28px] bg-white/95 p-3 shadow-[0_18px_35px_rgba(34,24,39,0.18)]">
                {selectedEvent?.qr_url ? (
                  <img
                    alt={`${selectedEvent.event_code} QR code`}
                    className="h-full w-full rounded-[20px] object-cover"
                    src={selectedEvent.qr_url}
                  />
                ) : (
                  <div className="text-center text-sm font-semibold text-[var(--primary)]">
                    QR preview
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <SelfieDropzone
            capture={false}
            description="Drag and drop the album batch for the selected event. These files will be posted to the backend photo upload endpoint with the active event code."
            helperText="JPG, PNG, WEBP - multiple images allowed"
            multiple
            onFilesSelected={(files) => {
              setSelectedFiles(files);
              toast.success(`${files.length} file(s) selected for ${selectedEvent?.event_code || "the active event"}`);
            }}
            title="Upload wedding album images"
          />
        </div>

        {selectedFiles.length ? (
          <div className="mt-5 rounded-[24px] border border-[rgba(124,61,143,0.12)] bg-white/85 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">Ready to upload</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              {selectedFiles.slice(0, 5).map((file) => (
                <li key={`${file.name}-${file.size}`}>{file.name}</li>
              ))}
            </ul>
            {selectedFiles.length > 5 ? (
              <p className="mt-3 text-sm text-[var(--muted)]">And {selectedFiles.length - 5} more file(s).</p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            disabled={!selectedEvent || !selectedFiles.length || isUploading}
            onClick={async () => {
              if (!selectedEvent || !selectedFiles.length) {
                toast.error("Select an event and choose photos first.");
                return;
              }

              try {
                setIsUploading(true);
                const data = await uploadPhotos({
                  eventCode: selectedEvent.event_code,
                  files: selectedFiles
                });
                setSelectedFiles([]);
                toast.success(`${data.queued} photo(s) uploaded for ${selectedEvent.event_code}`);

                const refreshedStatus = await getUploadStatus(selectedEvent.id);
                setStatusData(refreshedStatus);
                const refreshedEvents = await listEvents();
                setEvents(refreshedEvents);
              } catch (error) {
                const detail =
                  error?.response?.data?.detail ||
                  error?.response?.data?.images?.[0] ||
                  "Photo upload failed.";
                toast.error(detail);
              } finally {
                setIsUploading(false);
              }
            }}
          >
            {isUploading ? "Uploading..." : `Upload to ${selectedEvent?.event_code || "event"}`}
          </Button>
          <Button onClick={() => setSelectedFiles([])} variant="secondary">
            Clear selection
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-[rgba(124,61,143,0.12)] bg-white/85 p-5">
            <FolderUp className="text-[var(--primary)]" size={22} />
            <h2 className="mt-4 text-xl font-semibold text-[var(--text)]">Event-specific uploads</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Each batch is intentionally scoped to one wedding so the gallery and AI search stay accurate for that event.
            </p>
          </div>

          <div className="rounded-[24px] border border-[rgba(124,61,143,0.12)] bg-white/85 p-5">
            <TimerReset className="text-[var(--primary)]" size={22} />
            <h2 className="mt-4 text-xl font-semibold text-[var(--text)]">Async processing ready</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Processing status now comes from the backend, even if the AI face extraction step is not installed locally yet.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <p className="pill">Current upload queue</p>
        <h2 className="mt-4 text-2xl font-semibold text-[var(--text)]">
          {selectedEvent?.event_code || "No event selected"} uploads
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          The queue below is filtered for the selected wedding, so admins can review only the photos tied to that specific event.
        </p>

        {statusBreakdown.length ? (
          <div className="mt-5 flex flex-wrap gap-3">
            {statusBreakdown.map(([key, value]) => (
              <div
                key={key}
                className="rounded-full border border-[rgba(124,61,143,0.12)] bg-white/85 px-4 py-2 text-sm font-semibold text-[var(--text)]"
              >
                {formatStatusLabel(key)}: {value}
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          {isLoadingStatus ? <Loader label="Loading upload status..." /> : null}

          {statusData?.photos?.length ? (
            statusData.photos.map((item) => (
              <article
                key={item.id}
                className="rounded-[24px] border border-[rgba(124,61,143,0.12)] bg-white/85 p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text)]">{item.original_filename}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">{formatDate(item.uploaded_at)}</p>
                  </div>
                  <span className="rounded-full bg-[rgba(240,93,151,0.14)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                    {formatStatusLabel(item.processing_status)}
                  </span>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-[rgba(124,61,143,0.16)] bg-white/75 p-6 text-sm leading-6 text-[var(--muted)]">
              No files have been uploaded for this wedding yet. The next upload will be saved under event code{" "}
              <span className="font-semibold text-[var(--primary)]">{selectedEvent?.event_code || "-"}</span>.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default UploadPhotosPage;
