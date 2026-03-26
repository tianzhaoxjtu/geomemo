import type { ExperienceLevel } from "../../../entities/region/model/types";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";

interface VisitActionCardProps {
  hasProvince: boolean;
  cityName: string | null;
  isCityVisited: boolean;
  currentExperienceLevel: ExperienceLevel;
  onExperienceLevelChange: (experienceLevel: ExperienceLevel) => void;
  onClearCity: () => void;
  onMarkProvince: (experienceLevel: ExperienceLevel) => void;
  onClearProvince: () => void;
}

export function VisitActionCard({
  hasProvince,
  cityName,
  isCityVisited,
  currentExperienceLevel,
  onExperienceLevelChange,
  onClearCity,
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
                  cityName && isCityVisited && currentExperienceLevel === level
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-900/10"
                    : "bg-white text-slate-700 shadow-sm hover:-translate-y-0.5"
                }`}
                disabled={!cityName}
                onClick={() => onExperienceLevelChange(level)}
              >
                <p className="text-xs font-semibold">{t(`visit.experience.${level}`)}</p>
                <p
                  className={`mt-1 text-[11px] leading-4 ${
                    cityName && isCityVisited && currentExperienceLevel === level ? "text-white/70" : "text-slate-500"
                  }`}
                >
                  {t(`visit.experience.${level}Description`)}
                </p>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-[22px] border border-white/70 bg-white/80 px-4 py-3">
          <p className="text-sm font-medium text-slate-800">
            {cityName ? cityName : t("visit.selectCityPrompt")}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {cityName
              ? t("visit.citySelectionHint")
              : t("visit.chooseCity")}
          </p>
          <button
            className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
            onClick={onClearCity}
            disabled={!cityName || !isCityVisited}
          >
            {cityName ? t("visit.clearSelectedPlace") : t("visit.selectCityPrompt")}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            className="rounded-[22px] border border-white/70 bg-gradient-to-b from-white to-slate-50 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:text-slate-300"
            onClick={() => onMarkProvince(currentExperienceLevel)}
            disabled={!hasProvince}
          >
            {t("visit.applyLevelToProvince")}
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
