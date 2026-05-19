import { Camera, QrCode, ScanLine } from "lucide-react";

function QRScannerPanel({ active, onScan, onToggle }) {
  return (
    <div className="editorial-panel">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-[var(--text)]">Scan event QR</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Guests can scan the invitation or printed standee to auto-fill the event code.
          </p>
        </div>
        <button
          className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[rgba(140,79,65,0.1)] text-[var(--primary)]"
          onClick={onToggle}
          type="button"
        >
          {active ? <Camera size={18} /> : <QrCode size={18} />}
        </button>
      </div>

      {active ? (
        <div className="mt-5 rounded-[24px] border border-[rgba(117,82,65,0.14)] bg-[linear-gradient(180deg,rgba(140,79,65,0.08),rgba(215,143,98,0.12))] p-5">
          <div className="flex h-64 flex-col items-center justify-center rounded-[20px] border border-dashed border-[rgba(117,82,65,0.2)] bg-white/70 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-[22px] bg-[rgba(140,79,65,0.1)] text-[var(--primary)]">
              <QrCode size={30} />
              <span className="absolute inset-x-3 top-1/2 h-0.5 -translate-y-1/2 animate-pulse bg-[var(--accent)]" />
            </div>
            <p className="mt-5 text-lg font-semibold text-[var(--text)]">QR scan UI is staged for integration.</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">
              For the frontend MVP, this panel demonstrates the camera-ready flow. We can wire a production QR scanner in the next integration pass.
            </p>
            <button
              className="mt-5 inline-flex items-center rounded-full bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white"
              onClick={() => onScan("DEMO24")}
              type="button"
            >
              <ScanLine className="mr-2" size={16} />
              Use demo scan result
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-[24px] border border-dashed border-[rgba(117,82,65,0.18)] bg-[rgba(140,79,65,0.04)] px-5 py-8 text-center">
          <p className="font-semibold text-[var(--text)]">QR scanner is ready when you are.</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Tap the icon to open the camera and read the event code directly.
          </p>
        </div>
      )}
    </div>
  );
}

export default QRScannerPanel;
