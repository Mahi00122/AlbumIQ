import { useEffect, useState } from "react";

import { getUploadStatus } from "../services/photoService";


export function useUploadStatus(eventId, enabled = true) {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!eventId || !enabled) {
      return undefined;
    }

    let cancelled = false;

    const fetchStatus = async () => {
      try {
        const response = await getUploadStatus(eventId);
        if (!cancelled) {
          setStatus(response);
          setError("");
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError?.response?.data?.detail || "Unable to load processing status.");
        }
      }
    };

    fetchStatus();
    const intervalId = window.setInterval(fetchStatus, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [enabled, eventId]);

  return { status, error };
}

