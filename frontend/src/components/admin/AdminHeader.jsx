import { Bell, Search } from "lucide-react";

function AdminHeader() {
  return (
    <div className="glass-panel flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="pill">Admin Dashboard</p>
        <h1 className="mt-4 text-3xl font-extrabold text-[var(--text)] sm:text-4xl">
          Run event operations, uploads, and guest analytics from one place.
        </h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex items-center gap-3 rounded-full border border-[rgba(124,61,143,0.12)] bg-white px-4 py-3">
          <Search size={16} className="text-[var(--muted)]" />
          <span className="text-sm text-[var(--muted)]">Search events, uploads, guests</span>
        </div>
        <button
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(124,61,143,0.12)] bg-white text-[var(--primary)]"
          type="button"
        >
          <Bell size={18} />
        </button>
      </div>
    </div>
  );
}

export default AdminHeader;
