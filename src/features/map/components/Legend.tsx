import { useI18n } from "../../../shared/i18n/I18nProvider";

const items = [
  { key: "legend.visited", color: "bg-visited" },
  { key: "legend.partial", color: "bg-partial" },
  { key: "legend.unvisited", color: "bg-idle" },
];

interface LegendProps {
  className?: string;
}

export function Legend({ className = "" }: LegendProps) {
  const { t } = useI18n();

  return (
    <div
      className={`pointer-events-none inline-flex flex-wrap items-center gap-3 rounded-[20px] border border-white/70 bg-white/82 px-3.5 py-2.5 shadow-panel backdrop-blur-xl ${className}`.trim()}
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {t("legend.title")}
      </span>
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-2 text-xs font-medium text-slate-700">
          <span className={`h-3 w-3 rounded-full border border-white/80 shadow-sm ${item.color}`} />
          <span>{t(item.key)}</span>
        </div>
      ))}
    </div>
  );
}
