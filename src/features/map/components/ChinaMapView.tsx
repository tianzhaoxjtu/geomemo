import { regionIndex } from "../../../entities/region/model/regionIndex";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";
import { getProvinceVisualState } from "../../stats/model/statsSelectors";
import { getRegionFill, getRegionStroke } from "../lib/mapTheme";

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
        <svg viewBox="0 0 820 560" className="h-[460px] w-full">
          {regionIndex.provinces.map((province) => {
            const visualState = getProvinceVisualState(province.id, visitedCityIds);
            const isActive = activeProvinceId === province.id;

            return (
              <g
                key={province.id}
                className="group cursor-pointer"
                onClick={() => onProvinceClick(province.id)}
              >
                <path
                  d={province.shape.path}
                  fill={getRegionFill(visualState, isActive)}
                  stroke={getRegionStroke(isActive)}
                  strokeWidth={3}
                  className="origin-center transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:opacity-90"
                  style={{
                    filter: isActive
                      ? "drop-shadow(0 18px 18px rgba(15, 23, 42, 0.18))"
                      : "drop-shadow(0 8px 12px rgba(37, 99, 235, 0.08))",
                  }}
                />
                <text
                  x={province.shape.labelX}
                  y={province.shape.labelY}
                  textAnchor="middle"
                  className="fill-white text-[14px] font-semibold tracking-[0.01em] transition-opacity duration-300 group-hover:opacity-100"
                >
                  {province.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </SurfaceCard>
  );
}
