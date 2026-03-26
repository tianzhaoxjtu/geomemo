import type { ReactNode } from "react";
import { getProvinceCities } from "../../../entities/region/model/regionIndex";
import type { VisitedCityMap } from "../../../entities/visit/model/types";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";
import { AdminGeoMap } from "./AdminGeoMap";

interface ProvinceMapViewProps {
  provinceId: string;
  activeCityId: string | null;
  visitedCities: VisitedCityMap;
  onBack: () => void;
  onCityClick: (cityId: string) => void;
  overlay?: ReactNode;
}

export function ProvinceMapView({
  provinceId,
  activeCityId,
  visitedCities,
  onBack,
  onCityClick,
  overlay,
}: ProvinceMapViewProps) {
  const { t } = useI18n();
  const cities = getProvinceCities(provinceId);

  return (
    <SurfaceCard
      eyebrow={t("map.section")}
      title={t("map.provinceTitle")}
      description={t("map.provinceDescription")}
      aside={
        <button className="glass-button" onClick={onBack}>
          {t("map.backToChina")}
        </button>
      }
      className="fade-in-up overflow-hidden"
    >
      <div className="relative rounded-[28px] bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.10),_transparent_30%),linear-gradient(180deg,_#fcfdff,_#f5f8fc)] p-3">
        {overlay ? <div className="absolute right-4 top-4 z-10">{overlay}</div> : null}
        <AdminGeoMap
          mapCode={provinceId}
          activeCode={activeCityId}
          getVisualState={(regionCode) => (visitedCities[regionCode] ? "visited" : "unvisited")}
          getExperienceLevel={(regionCode) => visitedCities[regionCode]?.experienceLevel ?? null}
          onRegionClick={onCityClick}
          emptyMessage={
            cities.length > 0
              ? t("map.emptyProvince")
              : t("map.emptyProvinceWithMetadata")
          }
        />
      </div>
    </SurfaceCard>
  );
}
