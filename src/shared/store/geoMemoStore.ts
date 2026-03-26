import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isCanonicalCityId, isCanonicalProvinceId } from "../../data/adminDivisions";
import { getCityById, getProvinceCities } from "../../entities/region/model/regionIndex";
import type { ExperienceLevel } from "../../entities/region/model/types";
import { parseVisitImport } from "../../entities/visit/lib/visitTransfer";
import type { GeoMemoState, VisitEntry, VisitsState, VisitedCityMap } from "../../entities/visit/model/types";
import { STORAGE_KEY } from "../lib/storage";

interface GeoMemoActions {
  enterCountry: () => void;
  enterProvince: (provinceId: string) => void;
  selectCity: (cityId: string) => void;
  markCityVisited: (cityId: string, experienceLevel: ExperienceLevel) => void;
  clearCityVisited: (cityId: string) => void;
  setDraftExperienceLevel: (experienceLevel: ExperienceLevel) => void;
  markProvinceVisited: (provinceId: string, experienceLevel?: ExperienceLevel) => void;
  clearProvinceVisited: (provinceId: string) => void;
  resetCurrentScope: () => void;
  resetAllVisits: () => void;
  importVisits: (raw: string) => void;
  clearImportError: () => void;
}

export type GeoMemoStore = GeoMemoState & GeoMemoActions;

const initialState: GeoMemoState = {
  navigation: {
    level: "country",
    activeProvinceId: null,
    activeCityId: null,
  },
  visits: {
    visitedCities: {},
    history: [],
  },
  ui: {
    importError: null,
    lastImportedAt: null,
    draftExperienceLevel: "short",
  },
};

function createVisitEntry(experienceLevel: ExperienceLevel, previous?: VisitEntry): VisitEntry {
  const now = new Date().toISOString();

  return {
    experienceLevel,
    visitedAt: previous?.visitedAt ?? now,
    updatedAt: now,
  };
}

function recordVisit(
  history: VisitsState["history"],
  cityId: string,
  isVisited: boolean,
  experienceLevel: ExperienceLevel,
) {
  if (!isVisited) {
    return [...history, { cityId, visitedAt: new Date().toISOString(), experienceLevel }];
  }

  return history.filter((entry) => entry.cityId !== cityId);
}

function upsertVisit(
  visits: VisitsState,
  cityId: string,
  experienceLevel: ExperienceLevel,
): VisitsState {
  const alreadyVisited = Boolean(visits.visitedCities[cityId]);
  const current = visits.visitedCities[cityId];

  return {
    visitedCities: {
      ...visits.visitedCities,
      [cityId]: createVisitEntry(experienceLevel, current),
    },
    history: alreadyVisited
      ? visits.history.map((entry) =>
          entry.cityId === cityId ? { ...entry, experienceLevel } : entry,
        )
      : recordVisit(visits.history, cityId, false, experienceLevel),
  };
}

function clearCityVisit(visits: VisitsState, cityId: string): VisitsState {
  if (!visits.visitedCities[cityId]) {
    return visits;
  }

  const nextVisitedCities = { ...visits.visitedCities };
  delete nextVisitedCities[cityId];

  return {
    visitedCities: nextVisitedCities,
    history: visits.history.filter((entry) => entry.cityId !== cityId),
  };
}

function clearProvinceVisits(visits: VisitsState, provinceId: string): VisitsState {
  const nextVisitedCities = { ...visits.visitedCities };

  for (const city of getProvinceCities(provinceId)) {
    delete nextVisitedCities[city.id];
  }

  return {
    visitedCities: nextVisitedCities,
    history: visits.history.filter((entry) => getCityById(entry.cityId)?.provinceId !== provinceId),
  };
}

function normalizeHistoryEntries(state: any) {
  return Array.isArray(state?.visits?.history)
    ? state.visits.history
        .map((entry: any) => ({
          cityId: entry.cityId,
          visitedAt: entry.visitedAt,
          experienceLevel:
            entry.experienceLevel === "long" ||
            entry.experienceLevel === "medium" ||
            entry.experienceLevel === "short"
              ? entry.experienceLevel
              : "short",
        }))
        .filter((entry: { cityId: string; visitedAt: string }) => isCanonicalCityId(entry.cityId))
    : [];
}

function normalizePersistedState(state: any): Pick<GeoMemoState, "navigation" | "visits" | "ui"> {
  // Accept both the current structured payload and the older boolean visit map so
  // existing users do not lose data after schema changes.
  const visitedCitiesSource = state?.visits?.visitedCities ?? state?.visits?.visitedCityIds ?? {};
  const visitedCities: VisitedCityMap = {};

  for (const [cityId, value] of Object.entries(visitedCitiesSource as Record<string, any>)) {
    if (!isCanonicalCityId(cityId)) {
      continue;
    }

    if (value === true) {
      visitedCities[cityId] = createVisitEntry("short");
    } else if (value && typeof value === "object") {
      visitedCities[cityId] = {
        experienceLevel:
          value.experienceLevel === "long" || value.experienceLevel === "medium" || value.experienceLevel === "short"
            ? value.experienceLevel
            : "short",
        visitedAt: typeof value.visitedAt === "string" ? value.visitedAt : new Date().toISOString(),
        updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : undefined,
      };
    }
  }

  return {
    navigation: {
      level:
        state?.navigation?.level === "country" ||
        state?.navigation?.level === "province" ||
        state?.navigation?.level === "city"
          ? state.navigation.level
          : initialState.navigation.level,
      activeProvinceId:
        typeof state?.navigation?.activeProvinceId === "string" &&
        isCanonicalProvinceId(state.navigation.activeProvinceId)
          ? state.navigation.activeProvinceId
          : null,
      activeCityId:
        typeof state?.navigation?.activeCityId === "string" && isCanonicalCityId(state.navigation.activeCityId)
          ? state.navigation.activeCityId
          : null,
    },
    visits: {
      visitedCities,
      history: normalizeHistoryEntries(state),
    },
    ui: {
      ...initialState.ui,
      draftExperienceLevel:
        state?.ui?.draftExperienceLevel === "long" ||
        state?.ui?.draftExperienceLevel === "medium" ||
        state?.ui?.draftExperienceLevel === "short"
          ? state.ui.draftExperienceLevel
          : initialState.ui.draftExperienceLevel,
    },
  };
}

export const useGeoMemoStore = create<GeoMemoStore>()(
  persist(
    (set) => ({
      ...initialState,
      enterCountry: () =>
        set({
          navigation: {
            level: "country",
            activeProvinceId: null,
            activeCityId: null,
          },
        }),
      enterProvince: (provinceId) =>
        set((state) => ({
          navigation: {
            ...state.navigation,
            level: "province",
            activeProvinceId: provinceId,
            activeCityId: null,
          },
        })),
      selectCity: (cityId) =>
        set((state) => ({
          navigation: {
            ...state.navigation,
            level: "city",
            activeCityId: cityId,
            activeProvinceId: getCityById(cityId)?.provinceId ?? null,
          },
        })),
      markCityVisited: (cityId, experienceLevel) =>
        set((state) => ({
          visits: upsertVisit(state.visits, cityId, experienceLevel),
          ui: {
            ...state.ui,
            draftExperienceLevel: experienceLevel,
          },
        })),
      clearCityVisited: (cityId) =>
        set((state) => ({
          visits: clearCityVisit(state.visits, cityId),
        })),
      setDraftExperienceLevel: (experienceLevel) =>
        set((state) => ({
          ui: {
            ...state.ui,
            draftExperienceLevel: experienceLevel,
          },
        })),
      markProvinceVisited: (provinceId, experienceLevel) =>
        set((state) => {
          // Province-level marking is implemented as an explicit bulk operation that
          // writes second-level visit records. There is no separate persisted province flag.
          const level = experienceLevel ?? state.ui.draftExperienceLevel;
          const next = { ...state.visits.visitedCities };
          const history = [...state.visits.history];

          for (const city of getProvinceCities(provinceId)) {
            if (!next[city.id]) {
              next[city.id] = createVisitEntry(level);
              history.push({
                cityId: city.id,
                visitedAt: new Date().toISOString(),
                experienceLevel: level,
              });
            } else {
              next[city.id] = createVisitEntry(level, next[city.id]);
              const historyIndex = history.findIndex((entry) => entry.cityId === city.id);
              if (historyIndex >= 0) {
                history[historyIndex] = {
                  ...history[historyIndex],
                  experienceLevel: level,
                };
              }
            }
          }

          return {
            visits: {
              visitedCities: next,
              history,
            },
            ui: {
              ...state.ui,
              draftExperienceLevel: level,
            },
          };
        }),
      clearProvinceVisited: (provinceId) =>
        set((state) => {
          return {
            visits: clearProvinceVisits(state.visits, provinceId),
          };
        }),
      resetCurrentScope: () =>
        set((state) => {
          const provinceId = state.navigation.activeProvinceId;

          if (!provinceId) {
            return {
              navigation: initialState.navigation,
              visits: initialState.visits,
            };
          }

          return {
            visits: clearProvinceVisits(state.visits, provinceId),
          };
        }),
      resetAllVisits: () =>
        set({
          navigation: initialState.navigation,
          visits: initialState.visits,
        }),
      importVisits: (raw) => {
        try {
          const importedVisits = parseVisitImport(raw);

          set((state) => ({
            visits: importedVisits,
            ui: {
              ...state.ui,
              importError: null,
              lastImportedAt: new Date().toISOString(),
            },
          }));
        } catch (error) {
          set((state) => ({
            ui: {
              ...state.ui,
              importError: error instanceof Error ? error.message : "error.import.generic",
            },
          }));
        }
      },
      clearImportError: () =>
        set((state) => ({
          ui: {
            ...state.ui,
            importError: null,
          },
        })),
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      migrate: (persistedState) => normalizePersistedState(persistedState),
      partialize: (state) => ({
        navigation: state.navigation,
        visits: state.visits,
        ui: {
          draftExperienceLevel: state.ui.draftExperienceLevel,
        },
      }),
    },
  ),
);
