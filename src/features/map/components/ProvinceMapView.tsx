import type { ReactNode } from "react";
import { getProvinceById, getProvinceCities } from "../../../entities/region/model/regionIndex";
import type { VisitedCityMap } from "../../../entities/visit/model/types";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";
import { AdminGeoMap } from "./AdminGeoMap";
import { Legend } from "./Legend";
import type { MapImageExporter } from "../model/export";

interface ProvinceMapViewProps {
  provinceId: string;
  activeCityId: string | null;
  visitedCities: VisitedCityMap;
  onBack: () => void;
  onRegionSelect: (regionId: string) => void;
  overlay?: ReactNode;
  onExportReady?: (exporter: MapImageExporter | null) => void;
}

export function ProvinceMapView({
  provinceId,
  activeCityId,
  visitedCities,
  onBack,
  onRegionSelect,
  overlay,
  onExportReady,
}: ProvinceMapViewProps) {
  const { t } = useI18n();
  const province = getProvinceById(provinceId);
  const cities = getProvinceCities(provinceId);
  const canonicalSingleCityId =
    province?.mapDrillDownMode === "single-city" ? cities[0]?.id ?? null : null;
  const isGeometryUnavailable = province?.mapDrillDownMode === "unavailable";

  // Municipalities render district geometry, but the logical dataset intentionally
  // treats them as one municipality-equivalent second-level record.
  const resolveLogicalCityId = (regionCode: string) => canonicalSingleCityId ?? regionCode;
  const getCityVisualState = (regionCode: string) =>
    visitedCities[resolveLogicalCityId(regionCode)] ? "visited" : "unvisited";
  const getCityExperienceLevel = (regionCode: string) =>
    visitedCities[resolveLogicalCityId(regionCode)]?.experienceLevel ?? null;
  const handleRegionClick = (regionCode: string) => {
    const logicalCityId = resolveLogicalCityId(regionCode);

    if (logicalCityId) {
      onRegionSelect(logicalCityId);
    }
  };

  return (
    <SurfaceCard
      eyebrow={t("map.section")}
      title={t("map.provinceTitle")}
      description={
        isGeometryUnavailable
          ? t("map.provinceDescriptionUnavailable")
          : canonicalSingleCityId
            ? t("map.provinceDescriptionSingleCity")
            : t("map.provinceDescription")
      }
      aside={
        <button className="glass-button" onClick={onBack}>
          {t("map.backToChina")}
        </button>
      }
      className="fade-in-up flex h-full flex-col overflow-hidden"
    >
      <div className="relative flex-1 rounded-[28px] bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.10),_transparent_30%),linear-gradient(180deg,_#fcfdff,_#f5f8fc)] p-3 min-h-[520px] xl:min-h-0">
        {overlay ? <div className="absolute right-4 top-4 z-10">{overlay}</div> : null}
        <div className="absolute bottom-4 left-4 z-10">
          <Legend />
        </div>
        <AdminGeoMap
          mapCode={provinceId}
          activeCode={activeCityId}
          isRegionActive={(regionCode) => resolveLogicalCityId(regionCode) === activeCityId}
          getVisualState={getCityVisualState}
          getExperienceLevel={getCityExperienceLevel}
          onRegionClick={handleRegionClick}
          emptyMessage={
            cities.length > 0 && !isGeometryUnavailable
              ? t("map.emptyProvince")
              : t("map.emptyProvinceWithMetadata")
          }
          onExportReady={onExportReady}
          className="h-full min-h-[496px] xl:min-h-0"
        />
      </div>
    </SurfaceCard>
  );
}
