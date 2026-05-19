export function SectionCard({ eyebrow, title, subtitle, actions, children, className = "" }) {
  return (
    <section className={`surface-card ${className}`.trim()}>
      {(eyebrow || title || actions) && (
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2 className="section-title">{title}</h2>}
            {subtitle && <p className="max-w-2xl text-sm leading-6 text-stone-600">{subtitle}</p>}
          </div>
          {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}

