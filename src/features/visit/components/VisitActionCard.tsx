import type { ExperienceLevel } from "../../../entities/region/model/types";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";

interface VisitActionCardProps {
  hasProvince: boolean;
  cityName: string | null;
  isCityVisited: boolean;
  currentExperienceLevel: ExperienceLevel;
  onToggleCity: () => void;
  onExperienceLevelChange: (experienceLevel: ExperienceLevel) => void;
  onMarkProvince: () => void;
  onClearProvince: () => void;
}

export function VisitActionCard({
  hasProvince,
  cityName,
  isCityVisited,
  currentExperienceLevel,
  onToggleCity,
  onExperienceLevelChange,
  onMarkProvince,
  onClearProvince,
}: VisitActionCardProps) {
  const { t } = useI18n();
  const levels: ExperienceLevel[] = ["long", "medium", "short"];

  return (
    <SurfaceCard
      eyebrow={t("visit.actions")}
      title={t("visit.actionsTitle")}
      description={t("visit.actionsDescription")}
    >
      <div className="mt-4 space-y-3">
        <div className="rounded-[22px] border border-white/70 bg-slate-50/90 p-3">
          <div>
            <div>
              <p className="text-sm font-medium text-slate-800">{t("visit.experienceLabel")}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{t("visit.experienceHint")}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {levels.map((level) => (
              <button
                key={level}
                className={`rounded-[18px] px-3 py-2 text-left transition-all ${
                  currentExperienceLevel === level
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-900/10"
                    : "bg-white text-slate-700 shadow-sm hover:-translate-y-0.5"
                }`}
                onClick={() => onExperienceLevelChange(level)}
              >
                <p className="text-xs font-semibold">{t(`visit.experience.${level}`)}</p>
                <p
                  className={`mt-1 text-[11px] leading-4 ${
                    currentExperienceLevel === level ? "text-white/70" : "text-slate-500"
                  }`}
                >
                  {t(`visit.experience.${level}Description`)}
                </p>
              </button>
            ))}
          </div>
        </div>
        <button
          className="w-full rounded-[22px] bg-slate-950 px-4 py-3.5 text-sm font-medium text-white shadow-lg shadow-slate-900/15 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          onClick={onToggleCity}
          disabled={!cityName}
        >
          {cityName
            ? t(isCityVisited ? "visit.markUnvisited" : "visit.markVisited", { name: cityName })
            : t("visit.selectCityPrompt")}
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button
            className="rounded-[22px] border border-white/70 bg-gradient-to-b from-white to-slate-50 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:text-slate-300"
            onClick={onMarkProvince}
            disabled={!hasProvince}
          >
            {t("visit.markProvinceVisited")}
          </button>
          <button
            className="rounded-[22px] border border-white/70 bg-gradient-to-b from-white to-slate-50 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:text-slate-300"
            onClick={onClearProvince}
            disabled={!hasProvince}
          >
            {t("visit.clearProvince")}
          </button>
        </div>
      </div>
    </SurfaceCard>
  );
}
