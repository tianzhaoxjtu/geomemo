const items = [
  { label: "Visited", color: "bg-visited" },
  { label: "Partially visited", color: "bg-partial" },
  { label: "Unvisited", color: "bg-idle" },
];

export function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-[24px] border border-white/60 bg-white/72 px-4 py-3 shadow-panel backdrop-blur-xl">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Legend</span>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-sm text-slate-700">
          <span className={`h-3.5 w-3.5 rounded-full shadow-sm ${item.color}`} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
