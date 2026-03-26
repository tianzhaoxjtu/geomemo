import {
  adminDivisionPrefectureUnits,
  adminDivisionPrefectureUnitsByProvinceId,
  adminDivisionProvinces,
} from "../../../data/adminDivisions";
import type { City, Province } from "../model/types";
// The logical region model is normalized from the curated 34 / 293 admin dataset.
// GeoJSON geometry remains a separate concern under public/geojson/china.
export const provinces: Province[] = adminDivisionProvinces.map((province) => ({
  id: province.id,
  code: province.code,
  name: province.zhName,
  fullname: province.zhName,
  englishName: province.enName,
  filename: province.code,
  type: province.type,
  mapDrillDownMode: province.mapDrillDownMode,
  cityIds: province.prefectureUnitIds,
}));

export const cities: City[] = adminDivisionPrefectureUnits.map((unit) => ({
  id: unit.id,
  code: unit.code,
  name: unit.zhName,
  fullname: unit.zhName,
  englishName: unit.enName,
  provinceId: unit.parentProvinceId,
  administrativeLevel: unit.administrativeLevel,
  prefectureUnitType: unit.unitType,
}));

export const citiesByProvinceId = Object.fromEntries(
  provinces.map((province) => [
    province.id,
    (adminDivisionPrefectureUnitsByProvinceId[province.id] ?? []).map((unit) => ({
      id: unit.id,
      code: unit.code,
      name: unit.zhName,
      fullname: unit.zhName,
      englishName: unit.enName,
      provinceId: unit.parentProvinceId,
      administrativeLevel: unit.administrativeLevel,
      prefectureUnitType: unit.unitType,
    })),
  ]),
) as Record<string, City[]>;

export const provincesById = Object.fromEntries(
  provinces.map((province) => [province.id, province]),
) as Record<string, Province>;

export const citiesById = Object.fromEntries(cities.map((city) => [city.id, city])) as Record<
  string,
  City
>;

export function getProvinceCities(provinceId: string) {
  return citiesByProvinceId[provinceId] ?? [];
}
