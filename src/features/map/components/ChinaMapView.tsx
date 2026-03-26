import { useMemo, type ReactNode } from "react";
import type { VisitedCityMap } from "../../../entities/visit/model/types";
import { useI18n } from "../../../shared/i18n/I18nProvider";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";
import {
  getProvinceCoverageRatio,
  getProvinceExperienceLevel,
  getProvinceVisualState,
} from "../../stats/model/statsSelectors";
import { AdminGeoMap } from "./AdminGeoMap";
import { Legend } from "./Legend";
import type { MapImageExporter } from "../model/export";

interface ChinaMapViewProps {
  activeProvinceId: string | null;
  visitedCities: VisitedCityMap;
  onProvinceClick: (provinceId: string) => void;
  overlay?: ReactNode;
  onExportReady?: (exporter: MapImageExporter | null) => void;
}

export function ChinaMapView({
  activeProvinceId,
  visitedCities,
  onProvinceClick,
  overlay,
  onExportReady,
}: ChinaMapViewProps) {
  const { t } = useI18n();
  const initialView = useMemo(
    () => ({
      // Keep the full geometry available, but bias the initial overview toward the
      // mainland so the larger canvas emphasizes China, Hong Kong, Macao, and Taiwan
      // before the user intentionally zooms out toward the South China Sea inset.
      center: [104.6, 35.4] as [number, number],
      zoom: 1.32,
    }),
    [],
  );

  return (
    <SurfaceCard
      eyebrow={t("map.section")}
      title={t("map.countryTitle")}
      description={t("map.countryDescription")}
      aside={<span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-medium text-white">{t("map.badge")}</span>}
      className="fade-in-up flex h-full flex-col overflow-hidden"
    >
      <div className="relative flex-1 rounded-[28px] bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.10),_transparent_42%),linear-gradient(180deg,_#fcfdff,_#f5f8fc)] p-3 min-h-[520px] xl:min-h-0">
        {overlay ? <div className="absolute right-4 top-4 z-10">{overlay}</div> : null}
        <div className="absolute bottom-4 left-4 z-10">
          <Legend />
        </div>
        <AdminGeoMap
          mapCode="100000"
          activeCode={activeProvinceId}
          initialView={initialView}
          getVisualState={(regionCode) => getProvinceVisualState(regionCode, visitedCities)}
          getExperienceLevel={(regionCode) => getProvinceExperienceLevel(regionCode, visitedCities)}
          getCoverageRatio={(regionCode) => getProvinceCoverageRatio(regionCode, visitedCities)}
          onRegionClick={onProvinceClick}
          emptyMessage={t("map.emptyCountry")}
          onExportReady={onExportReady}
          className="h-full min-h-[496px] xl:min-h-0"
        />
      </div>
    </SurfaceCard>
  );
}
