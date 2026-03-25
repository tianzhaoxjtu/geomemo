export type RegionLevel = "country" | "province" | "city";

export type VisitVisualState = "unvisited" | "partial" | "visited";

export interface City {
  id: string;
  code?: string;
  name: string;
  provinceId: string;
  tile: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ProvinceShape {
  path: string;
  labelX: number;
  labelY: number;
}

export interface Province {
  id: string;
  name: string;
  code: string;
  shape: ProvinceShape;
  cityIds: string[];
}

export interface RegionStats {
  totalCities: number;
  visitedCities: number;
  cityVisitPercentage: number;
  totalProvinces: number;
  visitedProvinces: number;
  provinceVisitPercentage: number;
}

export interface RegionCollection {
  provinces: Province[];
  cities: City[];
}
