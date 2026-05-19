function AnalyticsChart({ series }) {
  const maxSearches = Math.max(...series.map((item) => item.searches));
  const maxUploads = Math.max(...series.map((item) => item.uploads));

  return (
    <div className="glass-panel">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="pill">Weekly performance</p>
          <h2 className="mt-4 text-2xl font-semibold text-[var(--text)]">Searches vs uploads</h2>
        </div>
        <div className="flex gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[var(--primary)]" />
            Searches
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[var(--accent)]" />
            Uploads
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-7 items-end gap-3">
        {series.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-3">
            <div className="flex h-52 items-end gap-2">
              <div
                className="w-4 rounded-full bg-[var(--primary)]"
                style={{ height: `${(item.searches / maxSearches) * 100}%` }}
              />
              <div
                className="w-4 rounded-full bg-[var(--accent)]"
                style={{ height: `${(item.uploads / maxUploads) * 100}%` }}
              />
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsChart;
