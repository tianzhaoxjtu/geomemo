import { getProvinceCities, getProvinceById } from "../../../entities/region/model/regionIndex";
import type { VisitedCityMap } from "../../../entities/visit/model/types";
import { localizeRegionName } from "../../../entities/region/model/regionNames";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";

interface RegionInfoPanelProps {
  level: "country" | "province" | "city";
  activeProvinceId: string | null;
  activeCityId: string | null;
  visitedCities: VisitedCityMap;
  onSelectCity: (cityId: string) => void;
}

export function RegionInfoPanel({
  level,
  activeProvinceId,
  activeCityId,
  visitedCities,
  onSelectCity,
}: RegionInfoPanelProps) {
  const { locale, t } = useI18n();

  if (!activeProvinceId) {
    return null;
  }

  const province = getProvinceById(activeProvinceId);
  if (!province) {
    return null;
  }
  const regionList = getProvinceCities(activeProvinceId);
  const activeRegion = regionList.find((region) => region.id === activeCityId) ?? null;

  return (
    <SurfaceCard
      eyebrow={t("visit.context")}
      title={localizeRegionName(province, locale) ?? province.fullname}
      description={
        level === "city" && activeRegion
          ? t("visit.selectedCity", {
              name: localizeRegionName(activeRegion, locale) ?? activeRegion.fullname,
            })
          : t("visit.chooseCity")
      }
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {t("visit.citiesInView", { count: regionList.length })}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {regionList.map((region) => {
          const isActive = region.id === activeCityId;
          const visitEntry = visitedCities[region.id];
          const visited = Boolean(visitEntry);
          const experienceLabel = visitEntry ? t(`visit.experience.${visitEntry.experienceLevel}`) : null;

          return (
            <button
              key={region.id}
              className={`flex w-full items-center justify-between rounded-[22px] border px-4 py-3.5 text-left text-sm transition-all duration-200 ${
                isActive
                  ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                  : "border-white/70 bg-gradient-to-b from-white to-slate-50 text-slate-700 hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white"
              }`}
              onClick={() => onSelectCity(region.id)}
            >
              <span className="font-medium">{localizeRegionName(region, locale) ?? region.fullname}</span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  isActive
                    ? "bg-white/15 text-white"
                    : visited
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {visited ? experienceLabel : t("visit.statusUnvisited")}
              </span>
            </button>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
