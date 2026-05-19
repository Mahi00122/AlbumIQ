import { Camera, QrCode } from "lucide-react";
import { useState } from "react";
import { QrReader } from "react-qr-reader";

import { parseEventCodeFromValue } from "../../utils/formatters";


export function QrScannerPanel({ onDetected }) {
  const [active, setActive] = useState(false);
  const [resultText, setResultText] = useState("");

  return (
    <div className="rounded-[24px] border border-stone-200 bg-stone-50/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Quick Entry</p>
          <p className="mt-2 text-lg font-semibold">Scan the QR from the wedding invite</p>
        </div>
        <button type="button" className="button-secondary gap-2 px-4 py-2" onClick={() => setActive((value) => !value)}>
          <Camera className="h-4 w-4" />
          {active ? "Stop scanner" : "Start scanner"}
        </button>
      </div>

      {active ? (
        <div className="overflow-hidden rounded-[20px] border border-stone-200 bg-black">
          <QrReader
            constraints={{ facingMode: "environment" }}
            onResult={(result) => {
              const text = result?.getText?.() || result?.text || "";
              if (!text) {
                return;
              }
              const eventCode = parseEventCodeFromValue(text);
              setResultText(eventCode);
              onDetected(eventCode);
            }}
            className="w-full"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-[20px] border border-dashed border-stone-300 bg-white/80 px-4 py-5 text-sm text-stone-600">
          <QrCode className="h-5 w-5 text-[var(--c-accent)]" />
          Camera access stays off until the guest chooses to start scanning.
        </div>
      )}

      {resultText ? <p className="mt-4 text-sm text-stone-600">Latest scan: {resultText}</p> : null}
    </div>
  );
}

