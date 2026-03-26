import { useMemo } from "react";
import { getCityById, getProvinceById } from "../../../entities/region/model/regionIndex";
import { getLocalizedCityName, getLocalizedProvinceName } from "../../../entities/region/model/regionNames";
import { getCountryStats, getProvinceExperienceLevel, getProvinceStats } from "../../stats/model/statsSelectors";
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
  const clearSelectedCity = useGeoMemoStore((store) => store.clearSelectedCity);
  const toggleCityVisited = useGeoMemoStore((store) => store.toggleCityVisited);
  const setDraftExperienceLevel = useGeoMemoStore((store) => store.setDraftExperienceLevel);
  const setCityExperienceLevel = useGeoMemoStore((store) => store.setCityExperienceLevel);
  const setProvinceExperienceLevel = useGeoMemoStore((store) => store.setProvinceExperienceLevel);
  const markProvinceVisited = useGeoMemoStore((store) => store.markProvinceVisited);
  const clearProvinceVisited = useGeoMemoStore((store) => store.clearProvinceVisited);
  const resetAllVisits = useGeoMemoStore((store) => store.resetAllVisits);

  return useMemo(() => {
    const activeProvince = getProvinceById(navigation.activeProvinceId);
    const activeCity = getCityById(navigation.activeCityId);
    const visitedCities = visits?.visitedCities ?? {};
    const activeCityExperienceLevel = activeCity
      ? visitedCities[activeCity.id]?.experienceLevel ?? null
      : null;
    const activeProvinceExperienceLevel = activeProvince
      ? getProvinceExperienceLevel(activeProvince.id, visitedCities)
      : null;

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
      clearSelectedCity,
      toggleCityVisited,
      setDraftExperienceLevel,
      setCityExperienceLevel,
      setProvinceExperienceLevel,
      markProvinceVisited,
      clearProvinceVisited,
      resetAllVisits,
      activeProvince,
      activeCity,
      activeProvinceName: getLocalizedProvinceName(navigation.activeProvinceId, locale),
      activeCityName: getLocalizedCityName(navigation.activeCityId, locale),
      countryStats: getCountryStats(visitedCities),
      provinceStats: activeProvince ? getProvinceStats(activeProvince.id, visitedCities) : null,
      cityVisited: activeCity ? Boolean(visitedCities[activeCity.id]) : false,
      activeCityExperienceLevel,
      activeProvinceExperienceLevel,
    };
  }, [
    navigation,
    visits,
    ui,
    enterCountry,
    enterProvince,
    selectCity,
    clearSelectedCity,
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
