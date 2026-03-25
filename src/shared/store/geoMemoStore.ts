import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCityById, getProvinceCities } from "../../entities/region/model/regionIndex";
import { parseVisitImport } from "../../entities/visit/lib/visitTransfer";
import type { GeoMemoState, VisitsState, VisitedCityMap } from "../../entities/visit/model/types";
import { STORAGE_KEY } from "../lib/storage";

interface GeoMemoActions {
  enterCountry: () => void;
  enterProvince: (provinceId: string) => void;
  selectCity: (cityId: string) => void;
  clearSelectedCity: () => void;
  toggleCityVisited: (cityId: string) => void;
  markProvinceVisited: (provinceId: string) => void;
  clearProvinceVisited: (provinceId: string) => void;
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
    visitedCityIds: {},
    history: [],
  },
  ui: {
    importError: null,
    lastImportedAt: null,
  },
};

function toggleMapEntry(map: VisitedCityMap, cityId: string) {
  const next = { ...map };

  if (next[cityId]) {
    delete next[cityId];
  } else {
    next[cityId] = true;
  }

  return next;
}

function recordVisit(history: VisitsState["history"], cityId: string, isVisited: boolean) {
  if (!isVisited) {
    return [...history, { cityId, visitedAt: new Date().toISOString() }];
  }

  return history.filter((entry) => entry.cityId !== cityId);
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
      clearSelectedCity: () =>
        set((state) => ({
          navigation: {
            ...state.navigation,
            level: state.navigation.activeProvinceId ? "province" : "country",
            activeCityId: null,
          },
        })),
      toggleCityVisited: (cityId) =>
        set((state) => ({
          visits: {
            visitedCityIds: toggleMapEntry(state.visits.visitedCityIds, cityId),
            history: recordVisit(
              state.visits.history,
              cityId,
              Boolean(state.visits.visitedCityIds[cityId]),
            ),
          },
        })),
      markProvinceVisited: (provinceId) =>
        set((state) => {
          const next = { ...state.visits.visitedCityIds };
          const history = [...state.visits.history];

          for (const city of getProvinceCities(provinceId)) {
            if (!next[city.id]) {
              next[city.id] = true;
              history.push({ cityId: city.id, visitedAt: new Date().toISOString() });
            }
          }

          return {
            visits: {
              visitedCityIds: next,
              history,
            },
          };
        }),
      clearProvinceVisited: (provinceId) =>
        set((state) => {
          const next = { ...state.visits.visitedCityIds };

          for (const city of getProvinceCities(provinceId)) {
            delete next[city.id];
          }

          return {
            visits: {
              visitedCityIds: next,
              history: state.visits.history.filter(
                (entry) => getCityById(entry.cityId)?.provinceId !== provinceId,
              ),
            },
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
              importError:
                error instanceof Error ? error.message : "Unable to import visit data.",
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
      partialize: (state) => ({
        navigation: state.navigation,
        visits: state.visits,
      }),
    },
  ),
);
