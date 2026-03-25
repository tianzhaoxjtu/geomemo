import type { GeoMemoExportPayload, VisitsState, VisitedCityMap } from "../model/types";

function normalizeVisitedCityIds(input: unknown): VisitedCityMap {
  if (!input || typeof input !== "object") {
    return {};
  }

  const next: VisitedCityMap = {};

  for (const [cityId, value] of Object.entries(input as Record<string, unknown>)) {
    if (value === true) {
      next[cityId] = true;
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

    if (typeof cityId === "string" && typeof visitedAt === "string") {
      return [{ cityId, visitedAt }];
    }

    return [];
  });
}

export function createExportPayload(visits: VisitsState): GeoMemoExportPayload {
  return {
    version: 1,
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
    visitedCityIds: normalizeVisitedCityIds(
      "visitedCityIds" in visits ? visits.visitedCityIds : undefined,
    ),
    history: normalizeHistory("history" in visits ? visits.history : undefined),
  };
}
