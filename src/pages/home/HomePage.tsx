import { useEffect } from "react";
import type { ExperienceLevel } from "../../entities/region/model/types";
import { BreadcrumbNav } from "../../features/map/components/BreadcrumbNav";
import { ChinaMapView } from "../../features/map/components/ChinaMapView";
import { Legend } from "../../features/map/components/Legend";
import { ProvinceMapView } from "../../features/map/components/ProvinceMapView";
import { ExperienceBreakdownPanel } from "../../features/stats/components/ExperienceBreakdownPanel";
import { HeroMetricsPanel } from "../../features/stats/components/HeroMetricsPanel";
import { getProvinceVisualState } from "../../features/stats/model/statsSelectors";
import { DataTransferCard } from "../../features/visit/components/DataTransferCard";
import { LanguageSwitcher } from "../../features/visit/components/LanguageSwitcher";
import { RegionInfoPanel } from "../../features/visit/components/RegionInfoPanel";
import { VisitActionCard } from "../../features/visit/components/VisitActionCard";
import { useGeoMemoViewModel } from "../../features/visit/hooks/useGeoMemoViewModel";
import { useVisitDataTransfer } from "../../features/visit/hooks/useVisitDataTransfer";
import { useI18n } from "../../shared/i18n/I18nProvider";

export function HomePage() {
  const {
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
    activeProvinceName,
    activeCityName,
    countryStats,
    provinceStats,
    cityVisited,
    activeCityExperienceLevel,
    activeProvinceExperienceLevel,
  } = useGeoMemoViewModel();
  const { downloadExport, importFile, importError, lastImportedAt, clearImportError } =
    useVisitDataTransfer();
  const { t } = useI18n();
  const { level, activeProvinceId, activeCityId } = navigation;
  const { visitedCities } = visits;

  useEffect(() => {
    document.title = `${t("app.name")} · ${t("app.title")}`;
  }, [t]);

  const currentExperienceLevel: ExperienceLevel =
    activeCityExperienceLevel ??
    activeProvinceExperienceLevel ??
    ui.draftExperienceLevel;

  const handleExperienceLevelChange = (experienceLevel: ExperienceLevel) => {
    if (activeCityId && visitedCities[activeCityId]) {
      setCityExperienceLevel(activeCityId, experienceLevel);
      return;
    }

    if (activeProvinceId && provinceStats && provinceStats.visitedCities > 0) {
      setProvinceExperienceLevel(activeProvinceId, experienceLevel);
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

  const resetButton = (
    <button
      className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/85 px-3.5 py-2 text-xs font-medium text-slate-700 shadow-[0_16px_30px_-18px_rgba(15,23,42,0.45)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
      onClick={resetAllVisits}
    >
      <svg className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M5.5 5.5A6 6 0 1 1 4 10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.5 2.75V5.5h2.75"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {t("header.resetVisits")}
    </button>
  );

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <header className="surface-card fade-in-up mb-8 overflow-hidden px-6 py-6 lg:px-8 lg:py-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(56,189,248,0.16),transparent_24%),radial-gradient(circle_at_83%_24%,rgba(251,191,36,0.15),transparent_20%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(248,250,252,0.88))]" />
        <div className="pointer-events-none absolute inset-x-[8%] top-6 h-28 rounded-full border border-white/35 opacity-60 blur-[1px]" />
        <div className="pointer-events-none absolute right-[14%] top-10 h-24 w-24 rounded-full bg-sky-100/45 blur-2xl" />
        <div className="pointer-events-none absolute left-[12%] bottom-5 h-20 w-56 rounded-full bg-amber-100/35 blur-3xl" />
        <div className="relative mb-6 flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              {t("stats.heroEyebrow")}
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              {t("app.title")}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              {t("app.subtitle")}
            </p>
          </div>
          <HeroMetricsPanel stats={countryStats} />
        </div>
      </header>

      <div className="mb-6">
        <BreadcrumbNav
          level={level}
          provinceName={activeProvinceName}
          cityName={activeCityName}
          onCountryClick={enterCountry}
          onProvinceClick={() => {
            if (activeProvinceId) {
              enterProvince(activeProvinceId);
            }
          }}
        />
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_390px]">
        <div className="space-y-4">
          {activeProvinceId ? (
            <ProvinceMapView
              provinceId={activeProvinceId}
              activeCityId={activeCityId}
              visitedCities={visitedCities}
              onBack={enterCountry}
              onCityClick={handleCityMapClick}
              overlay={resetButton}
            />
          ) : (
            <ChinaMapView
              activeProvinceId={activeProvinceId}
              visitedCities={visitedCities}
              onProvinceClick={handleProvinceMapClick}
              overlay={resetButton}
            />
          )}
          <Legend />
          <ExperienceBreakdownPanel stats={countryStats} />
        </div>

        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <RegionInfoPanel
            level={level}
            activeProvinceId={activeProvinceId}
            activeCityId={activeCityId}
            visitedCities={visitedCities}
            onSelectCity={selectCity}
          />
          <VisitActionCard
            hasProvince={Boolean(activeProvinceId)}
            cityName={activeCityName}
            isCityVisited={cityVisited}
            currentExperienceLevel={currentExperienceLevel}
            onExperienceLevelChange={handleExperienceLevelChange}
            onToggleCity={() => {
              if (activeCityId) {
                toggleCityVisited(activeCityId);
              }
            }}
            onMarkProvince={() => {
              if (activeProvinceId) {
                markProvinceVisited(activeProvinceId);
              }
            }}
            onClearProvince={() => {
              if (activeProvinceId) {
                clearProvinceVisited(activeProvinceId);
              }
            }}
          />
          <DataTransferCard
            importError={importError}
            lastImportedAt={lastImportedAt}
            onExport={downloadExport}
            onImport={importFile}
            onDismissError={clearImportError}
          />
        </aside>
      </section>
    </main>
  );
}
