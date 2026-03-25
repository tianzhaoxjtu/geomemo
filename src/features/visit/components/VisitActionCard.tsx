import { useI18n } from "../../../shared/i18n/I18nProvider";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";

interface VisitActionCardProps {
  hasProvince: boolean;
  cityName: string | null;
  isCityVisited: boolean;
  onToggleCity: () => void;
  onMarkProvince: () => void;
  onClearProvince: () => void;
}

export function VisitActionCard({
  hasProvince,
  cityName,
  isCityVisited,
  onToggleCity,
  onMarkProvince,
  onClearProvince,
}: VisitActionCardProps) {
  const { t } = useI18n();

  return (
    <SurfaceCard
      eyebrow={t("visit.actions")}
      title={t("visit.actionsTitle")}
      description={t("visit.actionsDescription")}
    >
      <div className="mt-4 space-y-3">
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
