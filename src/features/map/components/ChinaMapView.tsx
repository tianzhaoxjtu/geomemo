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
  fullViewport?: boolean;
}

export function ChinaMapView({
  activeProvinceId,
  visitedCities,
  onProvinceClick,
  overlay,
  onExportReady,
  fullViewport = false,
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
      className={`fade-in-up flex h-full flex-col overflow-hidden ${fullViewport ? "min-h-[100svh]" : ""}`.trim()}
    >
      <div
        className={`relative flex-1 rounded-[28px] bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.10),_transparent_42%),linear-gradient(180deg,_#fcfdff,_#f5f8fc)] p-3 ${
          fullViewport ? "min-h-[calc(100svh-9rem)]" : "min-h-[520px]"
        }`.trim()}
      >
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
          className={`h-full ${fullViewport ? "min-h-[calc(100svh-10.5rem)]" : "min-h-[496px]"}`.trim()}
        />
      </div>
    </SurfaceCard>
  );
}
