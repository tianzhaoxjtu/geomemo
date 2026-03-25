import { getProvinceCities } from "../../../entities/region/model/regionIndex";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";
import { getRegionFill, getRegionStroke } from "../lib/mapTheme";

interface ProvinceMapViewProps {
  provinceId: string;
  activeCityId: string | null;
  visitedCityIds: Record<string, true>;
  onBack: () => void;
  onCityClick: (cityId: string) => void;
}

export function ProvinceMapView({
  provinceId,
  activeCityId,
  visitedCityIds,
  onBack,
  onCityClick,
}: ProvinceMapViewProps) {
  const cities = getProvinceCities(provinceId);

  return (
    <SurfaceCard
      eyebrow="Map"
      title="Province Detail"
      description="Select a city tile to update your travel record. The active city receives a stronger focus state."
      aside={
        <button className="glass-button" onClick={onBack}>
          Back to China
        </button>
      }
      className="fade-in-up overflow-hidden"
    >
      <div className="rounded-[28px] bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.10),_transparent_30%),linear-gradient(180deg,_#fcfdff,_#f5f8fc)] p-3">
      <svg viewBox="0 0 460 360" className="h-[460px] w-full">
        {cities.map((city) => {
          const isActive = city.id === activeCityId;
          const visited = Boolean(visitedCityIds[city.id]);

          return (
            <g key={city.id} className="group cursor-pointer" onClick={() => onCityClick(city.id)}>
              <rect
                x={city.tile.x}
                y={city.tile.y}
                width={city.tile.width}
                height={city.tile.height}
                rx={22}
                fill={getRegionFill(visited ? "visited" : "unvisited", isActive)}
                stroke={getRegionStroke(isActive)}
                strokeWidth={3}
                className="origin-center transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:opacity-90"
                style={{
                  filter: isActive ? "drop-shadow(0 14px 18px rgba(15, 23, 42, 0.20))" : "drop-shadow(0 10px 14px rgba(15, 23, 42, 0.08))",
                }}
              />
              <text
                x={city.tile.x + city.tile.width / 2}
                y={city.tile.y + city.tile.height / 2}
                dominantBaseline="middle"
                textAnchor="middle"
                className="fill-white text-[16px] font-semibold tracking-[0.01em]"
              >
                {city.name}
              </text>
            </g>
          );
        })}
      </svg>
      </div>
    </SurfaceCard>
  );
}
