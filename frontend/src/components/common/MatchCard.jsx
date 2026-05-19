export function MatchCard({ imageUrl, similarity }) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-white/40 bg-white/80 shadow-[0_16px_40px_rgba(39,29,24,0.08)]">
      <div className="aspect-[4/5] overflow-hidden bg-stone-100">
        {imageUrl ? (
          <img src={imageUrl} alt="Matched wedding photo" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-500">No preview</div>
        )}
      </div>
      <div className="flex items-center justify-between px-4 py-4">
        <div>
          <p className="eyebrow">AI Match</p>
          <p className="mt-2 text-lg font-semibold">{similarity.toFixed(1)}%</p>
        </div>
        <span className="tag-pill">Face Match</span>
      </div>
    </article>
  );
}

