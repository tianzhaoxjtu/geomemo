import type { ExperienceLevel, RegionLevel } from "../../region/model/types";

export interface VisitEntry {
  experienceLevel: ExperienceLevel;
  visitedAt: string;
  updatedAt?: string;
}

export type VisitedCityMap = Record<string, VisitEntry>;

export interface VisitRecord {
  cityId: string;
  visitedAt: string;
  experienceLevel: ExperienceLevel;
}

export interface VisitsState {
  visitedCities: VisitedCityMap;
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
  draftExperienceLevel: ExperienceLevel;
}

export interface GeoMemoState {
  navigation: NavigationState;
  visits: VisitsState;
  ui: UIState;
}

export interface GeoMemoExportPayload {
  version: 2;
  exportedAt: string;
  visits: VisitsState;
}
