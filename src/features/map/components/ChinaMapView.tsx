import { regionIndex } from "../../../entities/region/model/regionIndex";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";
import { getProvinceVisualState } from "../../stats/model/statsSelectors";
import { AdminGeoMap } from "./AdminGeoMap";

interface ChinaMapViewProps {
  activeProvinceId: string | null;
  visitedCityIds: Record<string, true>;
  onProvinceClick: (provinceId: string) => void;
}

export function ChinaMapView({
  activeProvinceId,
  visitedCityIds,
  onProvinceClick,
}: ChinaMapViewProps) {
  return (
    <SurfaceCard
      eyebrow="Map"
      title="China Overview"
      description="A stylized national map with province-level completion states. Hover to inspect, click to dive deeper."
      aside={<span className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-medium text-white">Prototype map</span>}
      className="fade-in-up overflow-hidden"
    >
      <div className="rounded-[28px] bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.10),_transparent_42%),linear-gradient(180deg,_#fcfdff,_#f5f8fc)] p-3">
        <AdminGeoMap
          mapCode="100000"
          activeCode={activeProvinceId}
          getVisualState={(regionCode) => getProvinceVisualState(regionCode, visitedCityIds)}
          onRegionClick={onProvinceClick}
          emptyMessage="Country-level geometry is unavailable."
        />
      </div>
    </SurfaceCard>
  );
}
