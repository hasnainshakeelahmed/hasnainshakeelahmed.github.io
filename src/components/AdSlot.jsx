// AdSense-ready ad slot (design phase).
// Renders a labeled placeholder. Functions phase replaces the inner box with
// the real AdSense <ins> unit once the account is approved — the layout,
// spacing and labeling stay identical, so approval never shifts the design.
export default function AdSlot({ format = 'leaderboard' }) {
  const sizes = {
    leaderboard: 'h-[90px] max-w-[728px]',
    rectangle: 'h-[250px] max-w-[300px]',
  }
  return (
    <div className="my-8 flex flex-col items-center">
      <span className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
        Advertisement
      </span>
      <div
        className={`flex w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400 ${sizes[format] ?? sizes.leaderboard}`}
      >
        AdSense slot — {format} · activates after account approval
      </div>
    </div>
  )
}
