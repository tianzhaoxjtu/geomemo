import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCityById, getProvinceCities } from "../../entities/region/model/regionIndex";
import type { ExperienceLevel } from "../../entities/region/model/types";
import { parseVisitImport } from "../../entities/visit/lib/visitTransfer";
import type { GeoMemoState, VisitEntry, VisitsState, VisitedCityMap } from "../../entities/visit/model/types";
import { STORAGE_KEY } from "../lib/storage";

interface GeoMemoActions {
  enterCountry: () => void;
  enterProvince: (provinceId: string) => void;
  selectCity: (cityId: string) => void;
  toggleCityVisited: (cityId: string) => void;
  setDraftExperienceLevel: (experienceLevel: ExperienceLevel) => void;
  setCityExperienceLevel: (cityId: string, experienceLevel: ExperienceLevel) => void;
  setProvinceExperienceLevel: (provinceId: string, experienceLevel: ExperienceLevel) => void;
  markProvinceVisited: (provinceId: string) => void;
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

function toggleMapEntry(map: VisitedCityMap, cityId: string, experienceLevel: ExperienceLevel) {
  const next = { ...map };

  if (next[cityId]) {
    delete next[cityId];
  } else {
    next[cityId] = createVisitEntry(experienceLevel);
  }

  return next;
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

function normalizePersistedState(state: any): Pick<GeoMemoState, "navigation" | "visits" | "ui"> {
  // Accept both the current structured payload and the older boolean visit map so
  // existing users do not lose data after schema changes.
  const visitedCitiesSource = state?.visits?.visitedCities ?? state?.visits?.visitedCityIds ?? {};
  const visitedCities: VisitedCityMap = {};

  for (const [cityId, value] of Object.entries(visitedCitiesSource as Record<string, any>)) {
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
        typeof state?.navigation?.activeProvinceId === "string"
          ? state.navigation.activeProvinceId
          : null,
      activeCityId:
        typeof state?.navigation?.activeCityId === "string" ? state.navigation.activeCityId : null,
    },
    visits: {
      visitedCities,
      history: Array.isArray(state?.visits?.history)
        ? state.visits.history.map((entry: any) => ({
            cityId: entry.cityId,
            visitedAt: entry.visitedAt,
            experienceLevel:
              entry.experienceLevel === "long" || entry.experienceLevel === "medium" || entry.experienceLevel === "short"
                ? entry.experienceLevel
                : "short",
          }))
        : [],
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
      setDraftExperienceLevel: (experienceLevel) =>
        set((state) => ({
          ui: {
            ...state.ui,
            draftExperienceLevel: experienceLevel,
          },
        })),
      toggleCityVisited: (cityId) =>
        set((state) => ({
          visits: {
            visitedCities: toggleMapEntry(
              state.visits.visitedCities,
              cityId,
              state.ui.draftExperienceLevel,
            ),
            history: recordVisit(
              state.visits.history,
              cityId,
              Boolean(state.visits.visitedCities[cityId]),
              state.ui.draftExperienceLevel,
            ),
          },
        })),
      setCityExperienceLevel: (cityId, experienceLevel) =>
        set((state) => {
          const current = state.visits.visitedCities[cityId];

          if (!current) {
            return {
              ui: {
                ...state.ui,
                draftExperienceLevel: experienceLevel,
              },
            };
          }

          return {
            visits: {
              visitedCities: {
                ...state.visits.visitedCities,
                [cityId]: createVisitEntry(experienceLevel, current),
              },
              history: state.visits.history.map((entry) =>
                entry.cityId === cityId ? { ...entry, experienceLevel } : entry,
              ),
            },
            ui: {
              ...state.ui,
              draftExperienceLevel: experienceLevel,
            },
          };
        }),
      setProvinceExperienceLevel: (provinceId, experienceLevel) =>
        set((state) => {
          const next = { ...state.visits.visitedCities };
          let changed = false;

          for (const city of getProvinceCities(provinceId)) {
            const current = next[city.id];

            if (current) {
              next[city.id] = createVisitEntry(experienceLevel, current);
              changed = true;
            }
          }

          return {
            visits: {
              visitedCities: next,
              history: changed
                ? state.visits.history.map((entry) =>
                    getCityById(entry.cityId)?.provinceId === provinceId
                      ? { ...entry, experienceLevel }
                      : entry,
                  )
                : state.visits.history,
            },
            ui: {
              ...state.ui,
              draftExperienceLevel: experienceLevel,
            },
          };
        }),
      markProvinceVisited: (provinceId) =>
        set((state) => {
          const next = { ...state.visits.visitedCities };
          const history = [...state.visits.history];

          for (const city of getProvinceCities(provinceId)) {
            if (!next[city.id]) {
              next[city.id] = createVisitEntry(state.ui.draftExperienceLevel);
              history.push({
                cityId: city.id,
                visitedAt: new Date().toISOString(),
                experienceLevel: state.ui.draftExperienceLevel,
              });
            } else {
              next[city.id] = createVisitEntry(state.ui.draftExperienceLevel, next[city.id]);
            }
          }

          return {
            visits: {
              visitedCities: next,
              history,
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
