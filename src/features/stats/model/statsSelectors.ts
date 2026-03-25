import { regionIndex, getProvinceCities } from "../../../entities/region/model/regionIndex";
import type { RegionStats, VisitVisualState } from "../../../entities/region/model/types";
import type { VisitedCityMap } from "../../../entities/visit/model/types";

function toPercent(visited: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((visited / total) * 100);
}

export function isCityVisited(cityId: string, visitedCityIds: VisitedCityMap) {
  return Boolean(visitedCityIds[cityId]);
}

export function getProvinceVisitedCount(provinceId: string, visitedCityIds: VisitedCityMap) {
  return getProvinceCities(provinceId).filter((city) => isCityVisited(city.id, visitedCityIds)).length;
}

export function getProvinceVisualState(
  provinceId: string,
  visitedCityIds: VisitedCityMap,
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

export function getVisitedProvinceCount(visitedCityIds: VisitedCityMap) {
  return regionIndex.provinces.filter(
    (province) => getProvinceVisualState(province.id, visitedCityIds) === "visited",
  ).length;
}

export function getCountryStats(visitedCityIds: VisitedCityMap): RegionStats {
  const visitedCities = regionIndex.cities.filter((city) => isCityVisited(city.id, visitedCityIds)).length;
  const totalCities = regionIndex.cities.length;
  const visitedProvinces = getVisitedProvinceCount(visitedCityIds);
  const totalProvinces = regionIndex.provinces.length;

  return {
    totalCities,
    visitedCities,
    cityVisitPercentage: toPercent(visitedCities, totalCities),
    totalProvinces,
    visitedProvinces,
    provinceVisitPercentage: toPercent(visitedProvinces, totalProvinces),
  };
}

export function getProvinceStats(provinceId: string, visitedCityIds: VisitedCityMap) {
  const provinceCities = getProvinceCities(provinceId);
  const visitedCities = provinceCities.filter((city) => isCityVisited(city.id, visitedCityIds)).length;

  return {
    totalCities: provinceCities.length,
    visitedCities,
    cityVisitPercentage: toPercent(visitedCities, provinceCities.length),
  };
}
