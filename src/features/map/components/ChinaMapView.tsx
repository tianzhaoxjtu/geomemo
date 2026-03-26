import type { ReactNode } from "react";
import type { VisitedCityMap } from "../../../entities/visit/model/types";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";
import { getProvinceExperienceLevel, getProvinceVisualState } from "../../stats/model/statsSelectors";
import { AdminGeoMap } from "./AdminGeoMap";

interface ChinaMapViewProps {
  activeProvinceId: string | null;
  visitedCities: VisitedCityMap;
  onProvinceClick: (provinceId: string) => void;
  overlay?: ReactNode;
}

export function ChinaMapView({
  activeProvinceId,
  visitedCities,
  onProvinceClick,
  overlay,
}: ChinaMapViewProps) {
  const { t } = useI18n();

  return (
    <SurfaceCard
      eyebrow={t("map.section")}
      title={t("map.countryTitle")}
      description={t("map.countryDescription")}
      aside={<span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-medium text-white">{t("map.badge")}</span>}
      className="fade-in-up overflow-hidden"
    >
      <div className="relative rounded-[28px] bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.10),_transparent_42%),linear-gradient(180deg,_#fcfdff,_#f5f8fc)] p-3">
        {overlay ? <div className="absolute right-4 top-4 z-10">{overlay}</div> : null}
        <AdminGeoMap
          mapCode="100000"
          activeCode={activeProvinceId}
          getVisualState={(regionCode) => getProvinceVisualState(regionCode, visitedCities)}
          getExperienceLevel={(regionCode) => getProvinceExperienceLevel(regionCode, visitedCities)}
          onRegionClick={onProvinceClick}
          emptyMessage={t("map.emptyCountry")}
        />
      </div>
    </SurfaceCard>
  );
}
