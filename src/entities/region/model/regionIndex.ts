import {
  cities,
  citiesById,
  citiesByProvinceId,
  getProvinceCities,
  provinces,
  provincesById,
} from "../data/regions";
import type { City, Province, RegionCollection } from "./types";

export interface RegionIndex extends RegionCollection {
  provincesById: Record<string, Province>;
  citiesById: Record<string, City>;
  citiesByProvinceId: Record<string, City[]>;
}

export const regionIndex: RegionIndex = {
  provinces,
  cities,
  provincesById,
  citiesById,
  citiesByProvinceId,
};

export function getProvinceById(provinceId: string | null) {
  return provinceId ? regionIndex.provincesById[provinceId] ?? null : null;
}

export function getCityById(cityId: string | null) {
  return cityId ? regionIndex.citiesById[cityId] ?? null : null;
}

export { getProvinceCities };
