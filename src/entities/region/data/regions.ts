import regionData from "./china-regions.json";
import type { City, Province } from "../model/types";

type RegionDataFile = {
  provinces: Array<{
    code: string;
    name: string;
    fullname: string;
    pinyin: string;
    filename: string;
  }>;
  citiesByProvince: Record<
    string,
    Array<{
      code: string;
      name: string;
      fullname: string;
      pinyin: string;
      filename: string;
      level: number;
      center: [number, number] | null;
    }>
  >;
};

const typedRegionData = regionData as unknown as RegionDataFile;
const rawProvinces = typedRegionData.provinces.filter(
  (province) =>
    typeof province.code === "string" &&
    province.code.length > 0 &&
    typeof province.filename === "string" &&
    province.filename.length > 0,
);

export const provinces: Province[] = rawProvinces.map((province) => ({
  id: province.code,
  code: province.code,
  name: province.name,
  fullname: province.fullname,
  englishName: province.pinyin,
  filename: province.filename,
  cityIds: (typedRegionData.citiesByProvince[province.code] ?? []).map((city) => city.code),
}));

const validProvinceIds = new Set(provinces.map((province) => province.id));

export const cities: City[] = Object.entries(typedRegionData.citiesByProvince).flatMap(
  ([provinceId, provinceCities]) =>
    validProvinceIds.has(provinceId)
      ? provinceCities.map((city) => ({
          id: city.code,
          code: city.code,
          name: city.name,
          fullname: city.fullname,
          englishName: city.pinyin,
          provinceId,
        }))
      : [],
);

export const citiesByProvinceId = Object.fromEntries(
  provinces.map((province) => [
    province.id,
    cities.filter((city) => city.provinceId === province.id),
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
