import type { RegionLevel } from "../../region/model/types";

export type VisitedCityMap = Record<string, true>;

export interface VisitRecord {
  cityId: string;
  visitedAt: string;
}

export interface VisitsState {
  visitedCityIds: VisitedCityMap;
  history: VisitRecord[];
}

export interface NavigationState {
  level: RegionLevel;
  activeProvinceId: string | null;
  activeCityId: string | null;
}

export interface UIState {
  importError: string | null;
  lastImportedAt: string | null;
}

export interface GeoMemoState {
  navigation: NavigationState;
  visits: VisitsState;
  ui: UIState;
}

export interface GeoMemoExportPayload {
  version: 1;
  exportedAt: string;
  visits: VisitsState;
}
