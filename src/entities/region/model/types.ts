export type RegionLevel = "country" | "province" | "city";

export type VisitVisualState = "unvisited" | "partial" | "visited";
export type ExperienceLevel = "long" | "medium" | "short";

export interface City {
  id: string;
  code: string;
  name: string;
  fullname: string;
  englishName: string;
  provinceId: string;
}

export interface Province {
  id: string;
  name: string;
  fullname: string;
  englishName: string;
  code: string;
  filename: string;
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
