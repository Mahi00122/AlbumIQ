function Loader({ label = "Preparing your experience..." }) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-[var(--muted)]">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent-soft)] border-t-[var(--primary)]" />
      <span>{label}</span>
    </div>
  );
}

export default Loader;
