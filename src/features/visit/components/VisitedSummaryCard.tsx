import { regionIndex } from "../../../entities/region/model/regionIndex";
import { SurfaceCard } from "../../../shared/ui/SurfaceCard";

interface VisitedSummaryCardProps {
  visitedCityIds: Record<string, true>;
}

export function VisitedSummaryCard({ visitedCityIds }: VisitedSummaryCardProps) {
  const visitedCities = Object.keys(visitedCityIds)
    .map((cityId) => regionIndex.citiesById[cityId])
    .filter(Boolean);
  const visitedProvinceNames = Array.from(
    new Set(
      visitedCities.map((city) => regionIndex.provincesById[city.provinceId]?.fullname).filter(Boolean),
    ),
  ) as string[];

  return (
    <SurfaceCard
      eyebrow="Travel summary"
      title="Visited places"
      description="A quick snapshot of the places already recorded in this collection."
    >
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Provinces
          </p>
          <div className="flex flex-wrap gap-2">
            {visitedProvinceNames.length > 0 ? (
              visitedProvinceNames.map((name) => (
                <span
                  key={name}
                  className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700"
                >
                  {name}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
                No provinces completed yet
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Recent cities</p>
          <div className="flex flex-wrap gap-2">
            {visitedCities.length > 0 ? (
              visitedCities.slice(0, 8).map((city) => (
                <span
                  key={city.id}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm"
                >
                  {city.fullname}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
                Your city list will appear here
              </span>
            )}
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
