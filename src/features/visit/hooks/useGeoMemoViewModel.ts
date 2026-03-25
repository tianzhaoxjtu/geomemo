import { useMemo } from "react";
import { getCityById, getProvinceById } from "../../../entities/region/model/regionIndex";
import { getCountryStats, getProvinceStats } from "../../stats/model/statsSelectors";
import { useGeoMemoStore } from "../../../shared/store/geoMemoStore";

export function useGeoMemoViewModel() {
  const navigation = useGeoMemoStore((store) => store.navigation);
  const visits = useGeoMemoStore((store) => store.visits);
  const enterCountry = useGeoMemoStore((store) => store.enterCountry);
  const enterProvince = useGeoMemoStore((store) => store.enterProvince);
  const selectCity = useGeoMemoStore((store) => store.selectCity);
  const clearSelectedCity = useGeoMemoStore((store) => store.clearSelectedCity);
  const toggleCityVisited = useGeoMemoStore((store) => store.toggleCityVisited);
  const markProvinceVisited = useGeoMemoStore((store) => store.markProvinceVisited);
  const clearProvinceVisited = useGeoMemoStore((store) => store.clearProvinceVisited);
  const resetAllVisits = useGeoMemoStore((store) => store.resetAllVisits);

  return useMemo(() => {
    const activeProvince = getProvinceById(navigation.activeProvinceId);
    const activeCity = getCityById(navigation.activeCityId);

    return {
      navigation,
      visits,
      enterCountry,
      enterProvince,
      selectCity,
      clearSelectedCity,
      toggleCityVisited,
      markProvinceVisited,
      clearProvinceVisited,
      resetAllVisits,
      activeProvince,
      activeCity,
      activeProvinceName: activeProvince?.fullname ?? null,
      activeCityName: activeCity?.fullname ?? null,
      countryStats: getCountryStats(visits.visitedCityIds),
      provinceStats: activeProvince ? getProvinceStats(activeProvince.id, visits.visitedCityIds) : null,
      cityVisited: activeCity ? Boolean(visits.visitedCityIds[activeCity.id]) : false,
    };
  }, [
    navigation,
    visits,
    enterCountry,
    enterProvince,
    selectCity,
    clearSelectedCity,
    toggleCityVisited,
    markProvinceVisited,
    clearProvinceVisited,
    resetAllVisits,
  ]);
}
