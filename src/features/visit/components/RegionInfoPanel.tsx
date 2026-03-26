import { getProvinceCities, getProvinceById } from "../../../entities/region/model/regionIndex";
import { localizeRegionName } from "../../../entities/region/model/regionNames";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";

interface RegionInfoPanelProps {
  level: "country" | "province" | "city";
  activeProvinceId: string | null;
  activeCityId: string | null;
  visitedCityIds: Record<string, true>;
  onSelectCity: (cityId: string) => void;
}

export function RegionInfoPanel({
  level,
  activeProvinceId,
  activeCityId,
  visitedCityIds,
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
  const cityList = getProvinceCities(activeProvinceId);
  const activeCity = cityList.find((city) => city.id === activeCityId) ?? null;

  return (
    <SurfaceCard
      eyebrow={t("visit.context")}
      title={localizeRegionName(province, locale) ?? province.fullname}
      description={
        level === "city" && activeCity
          ? t("visit.selectedCity", {
              name: localizeRegionName(activeCity, locale) ?? activeCity.fullname,
            })
          : t("visit.chooseCity")
      }
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {t("visit.citiesInView", { count: cityList.length })}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {cityList.map((city) => {
          const isActive = city.id === activeCityId;
          const visited = Boolean(visitedCityIds[city.id]);

          return (
            <button
              key={city.id}
              className={`flex w-full items-center justify-between rounded-[22px] border px-4 py-3.5 text-left text-sm transition-all duration-200 ${
                isActive
                  ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                  : "border-white/70 bg-gradient-to-b from-white to-slate-50 text-slate-700 hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white"
              }`}
              onClick={() => onSelectCity(city.id)}
            >
              <span className="font-medium">{localizeRegionName(city, locale) ?? city.fullname}</span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  isActive
                    ? "bg-white/15 text-white"
                    : visited
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {visited ? t("visit.statusVisited") : t("visit.statusUnvisited")}
              </span>
            </button>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
