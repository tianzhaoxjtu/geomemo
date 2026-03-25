import { useI18n } from "../../../shared/i18n/I18nProvider";

const items = [
  { key: "legend.visited", color: "bg-visited" },
  { key: "legend.partial", color: "bg-partial" },
  { key: "legend.unvisited", color: "bg-idle" },
];

export function Legend() {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-[24px] border border-white/60 bg-white/72 px-4 py-3 shadow-panel backdrop-blur-xl">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{t("legend.title")}</span>
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-2 text-sm text-slate-700">
          <span className={`h-3.5 w-3.5 rounded-full shadow-sm ${item.color}`} />
          <span>{t(item.key)}</span>
        </div>
      ))}
    </div>
  );
}
