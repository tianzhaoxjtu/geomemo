import { getCityById, getProvinceById } from "./regionIndex";
import type { City, Province } from "./types";
import type { Locale } from "../../../shared/i18n/types";

function titleCaseWords(value: string) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function localizeRegionName(
  region: Pick<Province, "fullname" | "englishName"> | Pick<City, "fullname" | "englishName"> | null,
  locale: Locale,
) {
  if (!region) {
    return null;
  }

  return locale === "zh-CN" ? region.fullname : titleCaseWords(region.englishName);
}

export function getLocalizedProvinceName(provinceId: string | null, locale: Locale) {
  return localizeRegionName(getProvinceById(provinceId), locale);
}

export function getLocalizedCityName(cityId: string | null, locale: Locale) {
  return localizeRegionName(getCityById(cityId), locale);
}
