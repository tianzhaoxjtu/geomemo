import { useI18n } from "../../../shared/i18n/I18nProvider";

interface BreadcrumbNavProps {
  level: "country" | "province" | "city";
  provinceName: string | null;
  cityName: string | null;
  onCountryClick: () => void;
  onProvinceClick: () => void;
}

export function BreadcrumbNav({
  level,
  provinceName,
  cityName,
  onCountryClick,
  onProvinceClick,
}: BreadcrumbNavProps) {
  const { t } = useI18n();

  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
      <button className="glass-button px-3 py-1.5" onClick={onCountryClick}>
        {t("nav.china")}
      </button>
      {provinceName ? (
        <>
          <span>/</span>
          <button
            className="glass-button px-3 py-1.5"
            onClick={onProvinceClick}
          >
            {provinceName}
          </button>
        </>
      ) : null}
      {level === "city" && cityName ? (
        <>
          <span>/</span>
          <span className="rounded-full bg-slate-950 px-3 py-1.5 text-white shadow-lg shadow-slate-900/10">
            {cityName}
          </span>
        </>
      ) : null}
    </nav>
  );
}
