import { Download, X } from "lucide-react";

function GalleryModal({ item, onClose }) {
  if (!item) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(29,18,36,0.78)] px-4 py-6" role="dialog">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[30px] bg-white shadow-[0_28px_90px_rgba(0,0,0,0.35)]">
        <button
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white"
          onClick={onClose}
          type="button"
        >
          <X size={18} />
        </button>

        <img alt={item.title} className="h-[320px] w-full object-cover sm:h-[520px]" src={item.image} />

        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">
              Match confidence {item.score}
            </p>
            <h3 className="mt-2 text-3xl font-semibold text-[var(--text)]">{item.title}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">Captured at {item.time}</p>
          </div>

          <a
            className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white"
            download
            href={item.image}
            target="_blank"
            rel="noreferrer"
          >
            <Download className="mr-2" size={18} />
            Download photo
          </a>
        </div>
      </div>
    </div>
  );
}

export default GalleryModal;
