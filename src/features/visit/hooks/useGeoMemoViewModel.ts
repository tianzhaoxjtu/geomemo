import { useMemo } from "react";
import type { ExperienceLevel } from "../../../entities/region/model/types";
import { getCityById, getProvinceById } from "../../../entities/region/model/regionIndex";
import { getLocalizedCityName, getLocalizedProvinceName } from "../../../entities/region/model/regionNames";
import {
  getCountryStats,
  getProvinceExperienceLevel,
  getProvinceStats,
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
  const markCityVisited = useGeoMemoStore((store) => store.markCityVisited);
  const clearCityVisited = useGeoMemoStore((store) => store.clearCityVisited);
  const setDraftExperienceLevel = useGeoMemoStore((store) => store.setDraftExperienceLevel);
  const markProvinceVisited = useGeoMemoStore((store) => store.markProvinceVisited);
  const clearProvinceVisited = useGeoMemoStore((store) => store.clearProvinceVisited);
  const resetCurrentScope = useGeoMemoStore((store) => store.resetCurrentScope);

  return useMemo(() => {
    // This hook is the composition boundary between normalized store state and the
    // page-level UI. HomePage consumes view-ready names, stats, and intent handlers.
    const activeProvince = getProvinceById(navigation.activeProvinceId);
    const activeCity = getCityById(navigation.activeCityId);
    const visitedCities = visits?.visitedCities ?? {};
    const activeCityExperienceLevel = activeCity
      ? visitedCities[activeCity.id]?.experienceLevel ?? null
      : null;
    const provinceStats = activeProvince ? getProvinceStats(activeProvince.id, visitedCities) : null;
    const currentExperienceLevel: ExperienceLevel =
      activeCityExperienceLevel ?? ui.draftExperienceLevel;

    const handleExperienceLevelChange = (experienceLevel: ExperienceLevel) => {
      setDraftExperienceLevel(experienceLevel);

      if (navigation.activeCityId) {
        markCityVisited(navigation.activeCityId, experienceLevel);
        return;
      }
    };

    const handleProvinceMapClick = (provinceId: string) => {
      // Entering a province should never mutate child visit data. The province view must
      // reflect only the user's previously saved city records.
      enterProvince(provinceId);
    };

    const handleCityMapClick = (cityId: string) => {
      selectCity(cityId);
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
      markCityVisited,
      clearCityVisited,
      setDraftExperienceLevel,
      markProvinceVisited,
      clearProvinceVisited,
      resetCurrentScope,
      activeProvinceName: getLocalizedProvinceName(navigation.activeProvinceId, locale),
      activeCityName: getLocalizedCityName(navigation.activeCityId, locale),
      countryStats: getCountryStats(visitedCities),
      provinceStats,
      cityVisited: activeCity ? Boolean(visitedCities[activeCity.id]) : false,
      currentExperienceLevel,
      handleExperienceLevelChange,
      handleProvinceMapClick,
      handleCityMapClick,
      activeCityExperienceLevel,
    };
  }, [
    navigation,
    visits,
    ui,
    enterCountry,
    enterProvince,
    selectCity,
    markCityVisited,
    clearCityVisited,
    setDraftExperienceLevel,
    markProvinceVisited,
    clearProvinceVisited,
    resetCurrentScope,
    locale,
  ]);
}
