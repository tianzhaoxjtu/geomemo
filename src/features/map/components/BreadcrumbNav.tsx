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
  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
      <button className="glass-button px-3 py-1.5" onClick={onCountryClick}>
        China
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
