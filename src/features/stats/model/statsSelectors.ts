import { regionIndex, getProvinceCities } from "../../../entities/region/model/regionIndex";
import type { ExperienceLevel, RegionStats, VisitVisualState } from "../../../entities/region/model/types";
import type { VisitedCityMap } from "../../../entities/visit/model/types";

function ensureVisitedCities(visitedCityIds: VisitedCityMap | undefined | null): VisitedCityMap {
  return visitedCityIds ?? {};
}

function toPercent(visited: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((visited / total) * 100);
}

export function isCityVisited(cityId: string, visitedCityIds: VisitedCityMap | undefined | null) {
  const safeVisitedCityIds = ensureVisitedCities(visitedCityIds);
  return Boolean(safeVisitedCityIds[cityId]);
}

export function getCityExperienceLevel(
  cityId: string,
  visitedCityIds: VisitedCityMap | undefined | null,
): ExperienceLevel | null {
  const safeVisitedCityIds = ensureVisitedCities(visitedCityIds);
  return safeVisitedCityIds[cityId]?.experienceLevel ?? null;
}

export function getProvinceVisitedCount(provinceId: string, visitedCityIds: VisitedCityMap | undefined | null) {
  return getProvinceCities(provinceId).filter((city) => isCityVisited(city.id, visitedCityIds)).length;
}

export function getProvinceVisualState(
  provinceId: string,
  visitedCityIds: VisitedCityMap | undefined | null,
): VisitVisualState {
  const provinceCities = getProvinceCities(provinceId);
  const visitedCount = getProvinceVisitedCount(provinceId, visitedCityIds);

  if (visitedCount === 0) {
    return "unvisited";
  }

  if (visitedCount === provinceCities.length) {
    return "visited";
  }

  return "partial";
}

export function getVisitedProvinceCount(visitedCityIds: VisitedCityMap | undefined | null) {
  return regionIndex.provinces.filter(
    (province) => getProvinceVisualState(province.id, visitedCityIds) === "visited",
  ).length;
}

export function getProvinceExperienceLevel(
  provinceId: string,
  visitedCityIds: VisitedCityMap | undefined | null,
): ExperienceLevel | null {
  const counts: Record<ExperienceLevel, number> = {
    long: 0,
    medium: 0,
    short: 0,
  };

  for (const city of getProvinceCities(provinceId)) {
    const level = getCityExperienceLevel(city.id, visitedCityIds);

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

export function getExperienceBreakdown(visitedCityIds: VisitedCityMap | undefined | null) {
  const safeVisitedCityIds = ensureVisitedCities(visitedCityIds);
  const counts: Record<ExperienceLevel, number> = {
    long: 0,
    medium: 0,
    short: 0,
  };

  for (const entry of Object.values(safeVisitedCityIds)) {
    counts[entry.experienceLevel] += 1;
  }

  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);

  return {
    long: { count: counts.long, percentage: toPercent(counts.long, total) },
    medium: { count: counts.medium, percentage: toPercent(counts.medium, total) },
    short: { count: counts.short, percentage: toPercent(counts.short, total) },
  };
}

export function getCountryStats(visitedCityIds: VisitedCityMap | undefined | null): RegionStats {
  const safeVisitedCityIds = ensureVisitedCities(visitedCityIds);
  const visitedCities = regionIndex.cities.filter((city) => isCityVisited(city.id, safeVisitedCityIds)).length;
  const totalCities = regionIndex.cities.length;
  const visitedProvinces = getVisitedProvinceCount(safeVisitedCityIds);
  const totalProvinces = regionIndex.provinces.length;

  return {
    totalCities,
    visitedCities,
    cityVisitPercentage: toPercent(visitedCities, totalCities),
    totalProvinces,
    visitedProvinces,
    provinceVisitPercentage: toPercent(visitedProvinces, totalProvinces),
    experienceBreakdown: getExperienceBreakdown(safeVisitedCityIds),
  };
}

export function getProvinceStats(
  provinceId: string,
  visitedCityIds: VisitedCityMap | undefined | null,
): RegionStats {
  const safeVisitedCityIds = ensureVisitedCities(visitedCityIds);
  const provinceCities = getProvinceCities(provinceId);
  const visitedCities = provinceCities.filter((city) => isCityVisited(city.id, safeVisitedCityIds)).length;

  return {
    totalCities: provinceCities.length,
    visitedCities,
    cityVisitPercentage: toPercent(visitedCities, provinceCities.length),
    totalProvinces: 1,
    visitedProvinces: getProvinceVisualState(provinceId, safeVisitedCityIds) === "visited" ? 1 : 0,
    provinceVisitPercentage:
      getProvinceVisualState(provinceId, safeVisitedCityIds) === "visited" ? 100 : 0,
    experienceBreakdown: getExperienceBreakdown(
      Object.fromEntries(
        provinceCities
          .filter((city) => safeVisitedCityIds[city.id])
          .map((city) => [city.id, safeVisitedCityIds[city.id]]),
      ),
    ),
  };
}
