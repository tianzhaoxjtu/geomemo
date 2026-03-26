export type RegionLevel = "country" | "province" | "city";

export type VisitVisualState = "unvisited" | "partial" | "visited";
export type ExperienceLevel = "long" | "medium" | "short";
export type ProvinceType = "province" | "municipality" | "autonomous-region" | "sar" | "taiwan";
export type ProvinceMapDrillDownMode = "prefecture" | "single-city" | "unavailable";
export type AdministrativeLevel = "prefecture";
export type PrefectureUnitType =
  | "prefecture-city"
  | "autonomous-prefecture"
  | "league"
  | "prefecture"
  | "municipality-equivalent";

export interface City {
  id: string;
  code: string;
  name: string;
  fullname: string;
  englishName: string;
  provinceId: string;
  administrativeLevel: AdministrativeLevel;
  prefectureUnitType: PrefectureUnitType;
}

export interface Province {
  id: string;
  name: string;
  fullname: string;
  englishName: string;
  code: string;
  filename: string;
  type: ProvinceType;
  mapDrillDownMode: ProvinceMapDrillDownMode;
  cityIds: string[];
}

export interface RegionStats {
  totalCities: number;
  visitedCities: number;
  cityVisitPercentage: number;
  totalProvinces: number;
  visitedProvinces: number;
  provinceVisitPercentage: number;
  experienceBreakdown: Record<
    ExperienceLevel,
    {
      count: number;
      percentage: number;
    }
  >;
}

export interface RegionCollection {
  provinces: Province[];
  cities: City[];
}
