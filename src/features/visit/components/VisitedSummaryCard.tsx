import { regionIndex } from "../../../entities/region/model/regionIndex";
import { localizeRegionName } from "../../../entities/region/model/regionNames";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";

interface VisitedSummaryCardProps {
  visitedCityIds: Record<string, true>;
}

export function VisitedSummaryCard({ visitedCityIds }: VisitedSummaryCardProps) {
  const { locale, t } = useI18n();
  const visitedCities = Object.keys(visitedCityIds)
    .map((cityId) => regionIndex.citiesById[cityId])
    .filter(Boolean);
  const visitedProvinceNames = Array.from(
    new Set(
      visitedCities
        .map((city) => localizeRegionName(regionIndex.provincesById[city.provinceId] ?? null, locale))
        .filter(Boolean),
    ),
  ) as string[];

  return (
    <SurfaceCard
      eyebrow={t("visit.summary")}
      title={t("visit.summaryTitle")}
      description={t("visit.summaryDescription")}
    >
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {t("visit.summaryProvinces")}
          </p>
          <div className="flex flex-wrap gap-2">
            {visitedProvinceNames.length > 0 ? (
              visitedProvinceNames.map((name) => (
                <span
                  key={name}
                  className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700"
                >
                  {name}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
                {t("visit.summaryNoProvince")}
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{t("visit.summaryCities")}</p>
          <div className="flex flex-wrap gap-2">
            {visitedCities.length > 0 ? (
              visitedCities.slice(0, 8).map((city) => (
                <span
                  key={city.id}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm"
                >
                  {localizeRegionName(city, locale)}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
                {t("visit.summaryNoCity")}
              </span>
            )}
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
