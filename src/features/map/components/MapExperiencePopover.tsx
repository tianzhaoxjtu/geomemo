import type { ExperienceLevel } from "../../../entities/region/model/types";
import { useI18n } from "../../../shared/i18n/I18nProvider";

interface MapExperiencePopoverProps {
  regionName: string;
  currentExperienceLevel: ExperienceLevel;
  isVisited: boolean;
  onSelectLevel: (experienceLevel: ExperienceLevel) => void;
  onClear: () => void;
}

export function MapExperiencePopover({
  regionName,
  currentExperienceLevel,
  isVisited,
  onSelectLevel,
  onClear,
}: MapExperiencePopoverProps) {
  const { t } = useI18n();
  const levels: ExperienceLevel[] = ["long", "medium", "short"];

  return (
    <div className="w-[280px] rounded-[24px] border border-white/80 bg-white/90 p-3 shadow-[0_22px_40px_-24px_rgba(15,23,42,0.5)] backdrop-blur-xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        {t("map.quickMark")}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{regionName}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{t("map.quickMarkDescription")}</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {levels.map((level) => (
          <button
            key={level}
            className={`rounded-[18px] px-3 py-2 text-left transition-all ${
              isVisited && currentExperienceLevel === level
                ? "bg-slate-950 text-white shadow-lg shadow-slate-900/10"
                : "bg-slate-50 text-slate-700 shadow-sm hover:-translate-y-0.5 hover:bg-white"
            }`}
            onClick={() => onSelectLevel(level)}
          >
            <p className="text-[11px] font-semibold">{t(`visit.experience.${level}`)}</p>
            <p className={`mt-1 text-[10px] leading-4 ${isVisited && currentExperienceLevel === level ? "text-white/70" : "text-slate-500"}`}>
              {t(`visit.experience.${level}Description`)}
            </p>
          </button>
        ))}
      </div>
      <button
        className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
        onClick={onClear}
        disabled={!isVisited}
      >
        {t("visit.clearSelectedPlace")}
      </button>
    </div>
  );
}
