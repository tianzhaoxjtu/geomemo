import datasetJson from "./china-admin-divisions.json";
import type {
  AdminDivisionDataset,
  AdminDivisionPrefectureUnit,
  AdminDivisionProvince,
} from "./types";

const dataset = datasetJson as AdminDivisionDataset;

export const ADMIN_DIVISION_STANDARD = dataset.standard;
export const adminDivisionProvinces: AdminDivisionProvince[] = dataset.provinces;
export const adminDivisionPrefectureUnits: AdminDivisionPrefectureUnit[] = dataset.prefectureUnits;

export const adminProvinceIdSet = new Set(adminDivisionProvinces.map((province) => province.id));
export const adminPrefectureUnitIdSet = new Set(adminDivisionPrefectureUnits.map((unit) => unit.id));

export const adminDivisionProvincesById = Object.fromEntries(
  adminDivisionProvinces.map((province) => [province.id, province]),
) as Record<string, AdminDivisionProvince>;

export const adminDivisionPrefectureUnitsById = Object.fromEntries(
  adminDivisionPrefectureUnits.map((unit) => [unit.id, unit]),
) as Record<string, AdminDivisionPrefectureUnit>;

export const adminDivisionPrefectureUnitsByProvinceId = Object.fromEntries(
  adminDivisionProvinces.map((province) => [
    province.id,
    province.prefectureUnitIds
      .map((prefectureUnitId) => adminDivisionPrefectureUnitsById[prefectureUnitId])
      .filter(Boolean),
  ]),
) as Record<string, AdminDivisionPrefectureUnit[]>;

export function isCanonicalProvinceId(provinceId: string) {
  return adminProvinceIdSet.has(provinceId);
}

export function isCanonicalCityId(cityId: string) {
  return adminPrefectureUnitIdSet.has(cityId);
}
