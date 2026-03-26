import { regionIndex, getProvinceCities } from "../../../entities/region/model/regionIndex";
import type { ExperienceLevel, RegionStats, VisitVisualState } from "../../../entities/region/model/types";
import type { VisitedCityMap } from "../../../entities/visit/model/types";

// Keep selectors resilient during persisted-state hydration and legacy-data migration.
function ensureVisitedCities(visitedCities: VisitedCityMap | undefined | null): VisitedCityMap {
  return visitedCities ?? {};
}

function toPercent(visited: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((visited / total) * 100);
}

export function isCityVisited(cityId: string, visitedCities: VisitedCityMap | undefined | null) {
  const safeVisitedCities = ensureVisitedCities(visitedCities);
  return Boolean(safeVisitedCities[cityId]);
}

export function getCityExperienceLevel(
  cityId: string,
  visitedCities: VisitedCityMap | undefined | null,
): ExperienceLevel | null {
  const safeVisitedCities = ensureVisitedCities(visitedCities);
  return safeVisitedCities[cityId]?.experienceLevel ?? null;
}

export function getProvinceVisitedCount(provinceId: string, visitedCities: VisitedCityMap | undefined | null) {
  return getProvinceCities(provinceId).filter((city) => isCityVisited(city.id, visitedCities)).length;
}

export function getProvinceVisualState(
  provinceId: string,
  visitedCities: VisitedCityMap | undefined | null,
): VisitVisualState {
  const provinceCities = getProvinceCities(provinceId);
  const visitedCount = getProvinceVisitedCount(provinceId, visitedCities);

  if (visitedCount === 0) {
    return "unvisited";
  }

  if (visitedCount === provinceCities.length) {
    return "visited";
  }

  return "partial";
}

export function getVisitedProvinceCount(visitedCities: VisitedCityMap | undefined | null) {
  return regionIndex.provinces.filter(
    (province) => getProvinceVisualState(province.id, visitedCities) === "visited",
  ).length;
}

export function getProvinceExperienceLevel(
  provinceId: string,
  visitedCities: VisitedCityMap | undefined | null,
): ExperienceLevel | null {
  const counts: Record<ExperienceLevel, number> = {
    long: 0,
    medium: 0,
    short: 0,
  };

  for (const city of getProvinceCities(provinceId)) {
    const level = getCityExperienceLevel(city.id, visitedCities);

    if (level) {
      counts[level] += 1;
    }
  }

  if (counts.long === 0 && counts.medium === 0 && counts.short === 0) {
    return null;
  }

  if (counts.long >= counts.medium && counts.long >= counts.short) {
    return "long";
  }

  if (counts.medium >= counts.short) {
    return "medium";
  }

  return "short";
}

export function getExperienceBreakdown(visitedCities: VisitedCityMap | undefined | null) {
  const safeVisitedCities = ensureVisitedCities(visitedCities);
  const counts: Record<ExperienceLevel, number> = {
    long: 0,
    medium: 0,
    short: 0,
  };

  for (const entry of Object.values(safeVisitedCities)) {
    counts[entry.experienceLevel] += 1;
  }

  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);

  return {
    long: { count: counts.long, percentage: toPercent(counts.long, total) },
    medium: { count: counts.medium, percentage: toPercent(counts.medium, total) },
    short: { count: counts.short, percentage: toPercent(counts.short, total) },
  };
}

export function getCountryStats(visitedCities: VisitedCityMap | undefined | null): RegionStats {
  const safeVisitedCities = ensureVisitedCities(visitedCities);
  const visitedCityCount = regionIndex.cities.filter((city) => isCityVisited(city.id, safeVisitedCities)).length;
  const totalCities = regionIndex.cities.length;
  const visitedProvinces = getVisitedProvinceCount(safeVisitedCities);
  const totalProvinces = regionIndex.provinces.length;

  return {
    totalCities,
    visitedCities: visitedCityCount,
    cityVisitPercentage: toPercent(visitedCityCount, totalCities),
    totalProvinces,
    visitedProvinces,
    provinceVisitPercentage: toPercent(visitedProvinces, totalProvinces),
    experienceBreakdown: getExperienceBreakdown(safeVisitedCities),
  };
}

export function getProvinceStats(
  provinceId: string,
  visitedCities: VisitedCityMap | undefined | null,
): RegionStats {
  const safeVisitedCities = ensureVisitedCities(visitedCities);
  const provinceCities = getProvinceCities(provinceId);
  const visitedCityCount = provinceCities.filter((city) => isCityVisited(city.id, safeVisitedCities)).length;

  return {
    totalCities: provinceCities.length,
    visitedCities: visitedCityCount,
    cityVisitPercentage: toPercent(visitedCityCount, provinceCities.length),
    totalProvinces: 1,
    visitedProvinces: getProvinceVisualState(provinceId, safeVisitedCities) === "visited" ? 1 : 0,
    provinceVisitPercentage:
      getProvinceVisualState(provinceId, safeVisitedCities) === "visited" ? 100 : 0,
    experienceBreakdown: getExperienceBreakdown(
      Object.fromEntries(
        provinceCities
          .filter((city) => safeVisitedCities[city.id])
          .map((city) => [city.id, safeVisitedCities[city.id]]),
      ),
    ),
  };
}
