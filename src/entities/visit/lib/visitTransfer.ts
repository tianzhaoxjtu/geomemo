import type { ExperienceLevel } from "../../region/model/types";
import { isCanonicalCityId } from "../../../data/adminDivisions";
import type { GeoMemoExportPayload, VisitEntry, VisitsState, VisitedCityMap } from "../model/types";

const DEFAULT_EXPERIENCE_LEVEL: ExperienceLevel = "short";

function normalizeExperienceLevel(value: unknown): ExperienceLevel {
  return value === "long" || value === "medium" || value === "short"
    ? value
    : DEFAULT_EXPERIENCE_LEVEL;
}

function normalizeVisitedCities(input: unknown): VisitedCityMap {
  if (!input || typeof input !== "object") {
    return {};
  }

  const next: VisitedCityMap = {};

  for (const [cityId, value] of Object.entries(input as Record<string, unknown>)) {
    if (!isCanonicalCityId(cityId)) {
      continue;
    }

    if (value === true) {
      next[cityId] = {
        experienceLevel: DEFAULT_EXPERIENCE_LEVEL,
        visitedAt: new Date().toISOString(),
      };
      continue;
    }

    if (value && typeof value === "object") {
      const entry = value as Partial<VisitEntry>;
      const visitedAt =
        typeof entry.visitedAt === "string" ? entry.visitedAt : new Date().toISOString();

      next[cityId] = {
        experienceLevel: normalizeExperienceLevel(entry.experienceLevel),
        visitedAt,
        updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : undefined,
      };
    }
  }

  return next;
}

function normalizeHistory(input: unknown) {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.flatMap((item) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const cityId = "cityId" in item ? item.cityId : null;
    const visitedAt = "visitedAt" in item ? item.visitedAt : null;
    const experienceLevel = "experienceLevel" in item ? item.experienceLevel : DEFAULT_EXPERIENCE_LEVEL;

    if (typeof cityId === "string" && typeof visitedAt === "string" && isCanonicalCityId(cityId)) {
      return [{ cityId, visitedAt, experienceLevel: normalizeExperienceLevel(experienceLevel) }];
    }

    return [];
  });
}

export function createExportPayload(visits: VisitsState): GeoMemoExportPayload {
  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    visits,
  };
}

export function serializeVisitData(visits: VisitsState) {
  return JSON.stringify(createExportPayload(visits), null, 2);
}

export function parseVisitImport(raw: string): VisitsState {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("error.import.invalidJson");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("error.import.missingShape");
  }

  const visits =
    "visits" in parsed && parsed.visits && typeof parsed.visits === "object"
      ? parsed.visits
      : parsed;

  if (!visits || typeof visits !== "object") {
    throw new Error("error.import.missingVisits");
  }

  return {
    visitedCities: normalizeVisitedCities(
      "visitedCities" in visits
        ? visits.visitedCities
        : "visitedCityIds" in visits
          ? visits.visitedCityIds
          : undefined,
    ),
    history: normalizeHistory("history" in visits ? visits.history : undefined),
  };
}
