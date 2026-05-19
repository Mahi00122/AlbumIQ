function StatCard({ label, value, change }) {
  return (
    <article className="glass-panel">
      <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <h3 className="text-3xl font-extrabold text-[var(--text)]">{value}</h3>
        <span className="rounded-full bg-[rgba(40,123,98,0.12)] px-3 py-1 text-xs font-semibold text-[var(--success)]">
          {change}
        </span>
      </div>
    </article>
  );
}

export default StatCard;
