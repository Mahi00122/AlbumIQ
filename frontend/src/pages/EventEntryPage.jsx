import { ArrowRight, KeyRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { QrScannerPanel } from "../components/common/QrScannerPanel";
import { SectionCard } from "../components/common/SectionCard";
import { parseEventCodeFromValue } from "../utils/formatters";


export default function EventEntryPage() {
  const [eventCode, setEventCode] = useState("");
  const navigate = useNavigate();

  const continueToEvent = (code) => {
    const normalizedCode = parseEventCodeFromValue(code);
    if (!normalizedCode) {
      return;
    }
    navigate(`/event/${normalizedCode}`);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
      <SectionCard
        eyebrow="Guest Entry"
        title="Enter your wedding event code"
        subtitle="Use the code shared by the photographer or scan the QR to jump straight into selfie upload."
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            continueToEvent(eventCode);
          }}
        >
          <label className="block space-y-2">
            <span className="text-sm font-medium text-stone-700">Event code</span>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  className="input-field pl-11"
                  value={eventCode}
                  onChange={(event) => setEventCode(event.target.value.toUpperCase())}
                  placeholder="WED-AX12"
                  required
                />
              </div>
              <button type="submit" className="button-primary gap-2">
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </label>
        </form>
      </SectionCard>

      <SectionCard
        eyebrow="QR Flow"
        title="Jump in faster with a scan"
        subtitle="Perfect for wedding welcome boards, invitation cards, and photographer handouts."
      >
        <QrScannerPanel onDetected={continueToEvent} />
      </SectionCard>
    </div>
  );
}

