import { useMemo } from "react";
import type { ExperienceLevel } from "../../../entities/region/model/types";
import { getCityById, getProvinceById } from "../../../entities/region/model/regionIndex";
import { getLocalizedCityName, getLocalizedProvinceName } from "../../../entities/region/model/regionNames";
import {
  getCountryStats,
  getProvinceExperienceLevel,
  getProvinceStats,
  getProvinceVisualState,
} from "../../stats/model/statsSelectors";
import { useGeoMemoStore } from "../../../shared/store/geoMemoStore";
import { useI18n } from "../../../shared/i18n/I18nProvider";

export function useGeoMemoViewModel() {
  const { locale } = useI18n();
  const navigation = useGeoMemoStore((store) => store.navigation);
  const visits = useGeoMemoStore((store) => store.visits);
  const ui = useGeoMemoStore((store) => store.ui);
  const enterCountry = useGeoMemoStore((store) => store.enterCountry);
  const enterProvince = useGeoMemoStore((store) => store.enterProvince);
  const selectCity = useGeoMemoStore((store) => store.selectCity);
  const toggleCityVisited = useGeoMemoStore((store) => store.toggleCityVisited);
  const setDraftExperienceLevel = useGeoMemoStore((store) => store.setDraftExperienceLevel);
  const setCityExperienceLevel = useGeoMemoStore((store) => store.setCityExperienceLevel);
  const setProvinceExperienceLevel = useGeoMemoStore((store) => store.setProvinceExperienceLevel);
  const markProvinceVisited = useGeoMemoStore((store) => store.markProvinceVisited);
  const clearProvinceVisited = useGeoMemoStore((store) => store.clearProvinceVisited);
  const resetAllVisits = useGeoMemoStore((store) => store.resetAllVisits);

  return useMemo(() => {
    // This hook is the composition boundary between normalized store state and the
    // page-level UI. HomePage consumes view-ready names, stats, and intent handlers.
    const activeProvince = getProvinceById(navigation.activeProvinceId);
    const activeCity = getCityById(navigation.activeCityId);
    const visitedCities = visits?.visitedCities ?? {};
    const activeCityExperienceLevel = activeCity
      ? visitedCities[activeCity.id]?.experienceLevel ?? null
      : null;
    const activeProvinceExperienceLevel = activeProvince
      ? getProvinceExperienceLevel(activeProvince.id, visitedCities)
      : null;
    const provinceStats = activeProvince ? getProvinceStats(activeProvince.id, visitedCities) : null;
    const currentExperienceLevel: ExperienceLevel =
      activeCityExperienceLevel ?? activeProvinceExperienceLevel ?? ui.draftExperienceLevel;

    const handleExperienceLevelChange = (experienceLevel: ExperienceLevel) => {
      if (navigation.activeCityId && visitedCities[navigation.activeCityId]) {
        setCityExperienceLevel(navigation.activeCityId, experienceLevel);
        return;
      }

      if (navigation.activeProvinceId && provinceStats && provinceStats.visitedCities > 0) {
        setProvinceExperienceLevel(navigation.activeProvinceId, experienceLevel);
        return;
      }

      setDraftExperienceLevel(experienceLevel);
    };

    const handleProvinceMapClick = (provinceId: string) => {
      const currentState = getProvinceVisualState(provinceId, visitedCities);

      if (currentState === "visited") {
        clearProvinceVisited(provinceId);
      } else {
        markProvinceVisited(provinceId);
      }

      enterProvince(provinceId);
    };

    const handleCityMapClick = (cityId: string) => {
      selectCity(cityId);
      toggleCityVisited(cityId);
    };

    return {
      navigation,
      visits: {
        ...visits,
        visitedCities,
      },
      ui,
      enterCountry,
      enterProvince,
      selectCity,
      toggleCityVisited,
      markProvinceVisited,
      clearProvinceVisited,
      resetAllVisits,
      activeProvinceName: getLocalizedProvinceName(navigation.activeProvinceId, locale),
      activeCityName: getLocalizedCityName(navigation.activeCityId, locale),
      countryStats: getCountryStats(visitedCities),
      provinceStats,
      cityVisited: activeCity ? Boolean(visitedCities[activeCity.id]) : false,
      currentExperienceLevel,
      handleExperienceLevelChange,
      handleProvinceMapClick,
      handleCityMapClick,
    };
  }, [
    navigation,
    visits,
    ui,
    enterCountry,
    enterProvince,
    selectCity,
    toggleCityVisited,
    setDraftExperienceLevel,
    setCityExperienceLevel,
    setProvinceExperienceLevel,
    markProvinceVisited,
    clearProvinceVisited,
    resetAllVisits,
    locale,
  ]);
}
