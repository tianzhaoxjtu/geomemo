export type AdminProvinceType =
  | "province"
  | "municipality"
  | "autonomous-region"
  | "sar"
  | "taiwan";

export type AdminMapDrillDownMode = "prefecture" | "single-city" | "unavailable";

export type AdminAdministrativeLevel = "prefecture";
export type AdminPrefectureUnitType =
  | "prefecture-city"
  | "autonomous-prefecture"
  | "league"
  | "prefecture"
  | "municipality-equivalent";

export interface AdminDivisionStandard {
  provinceLevelUnitCount: number;
  prefectureLevelUnitCount: number;
  excludesRootChinaNodeFromProvinceMetrics: boolean;
  notes: string[];
}

export interface AdminDivisionProvince {
  id: string;
  code: string;
  zhName: string;
  enName: string;
  type: AdminProvinceType;
  mapDrillDownMode: AdminMapDrillDownMode;
  prefectureUnitIds: string[];
}

export interface AdminDivisionPrefectureUnit {
  id: string;
  code: string;
  zhName: string;
  enName: string;
  parentProvinceId: string;
  administrativeLevel: AdminAdministrativeLevel;
  unitType: AdminPrefectureUnitType;
}

export interface AdminDivisionDataset {
  standard: AdminDivisionStandard;
  provinces: AdminDivisionProvince[];
  prefectureUnits: AdminDivisionPrefectureUnit[];
}
