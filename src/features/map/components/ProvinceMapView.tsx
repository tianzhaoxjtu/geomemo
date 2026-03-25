import { getProvinceCities } from "../../../entities/region/model/regionIndex";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";
import { AdminGeoMap } from "./AdminGeoMap";

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
      description="Select a city-level administrative region to update your travel record. The active region receives a stronger focus state."
      aside={
        <button className="glass-button" onClick={onBack}>
          Back to China
        </button>
      }
      className="fade-in-up overflow-hidden"
    >
      <div className="rounded-[28px] bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.10),_transparent_30%),linear-gradient(180deg,_#fcfdff,_#f5f8fc)] p-3">
        <AdminGeoMap
          mapCode={provinceId}
          activeCode={activeCityId}
          getVisualState={(regionCode) => (visitedCityIds[regionCode] ? "visited" : "unvisited")}
          onRegionClick={onCityClick}
          emptyMessage={
            cities.length > 0
              ? "City-level geometry is unavailable for this province."
              : "This province does not currently expose city-level geometry in the dataset."
          }
        />
      </div>
    </SurfaceCard>
  );
}
