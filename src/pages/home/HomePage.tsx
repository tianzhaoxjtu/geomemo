import { useEffect, useState } from "react";
import { BreadcrumbNav } from "../../features/map/components/BreadcrumbNav";
import { ChinaMapView } from "../../features/map/components/ChinaMapView";
import { MapExperiencePopover } from "../../features/map/components/MapExperiencePopover";
import { MapResetButton } from "../../features/map/components/MapResetButton";
import { ProvinceMapView } from "../../features/map/components/ProvinceMapView";
import type { MapImageExporter, MapImageFormat } from "../../features/map/model/export";
import { ExperienceBreakdownPanel } from "../../features/stats/components/ExperienceBreakdownPanel";
import { HeroMetricsPanel } from "../../features/stats/components/HeroMetricsPanel";
import { DataTransferCard } from "../../features/visit/components/DataTransferCard";
import { LanguageSwitcher } from "../../features/visit/components/LanguageSwitcher";
import { RegionInfoPanel } from "../../features/visit/components/RegionInfoPanel";
import { useGeoMemoViewModel } from "../../features/visit/hooks/useGeoMemoViewModel";
import { useVisitDataTransfer } from "../../features/visit/hooks/useVisitDataTransfer";
import { useI18n } from "../../shared/i18n/I18nProvider";

export function HomePage() {
  const [mapImageExporter, setMapImageExporter] = useState<MapImageExporter | null>(null);
  const {
    navigation,
    visits,
    enterCountry,
    enterProvince,
    selectCity,
    clearCityVisited,
    resetCurrentScope,
    activeProvinceName,
    activeCityName,
    countryStats,
    cityVisited,
    currentExperienceLevel,
    handleExperienceLevelChange,
    handleProvinceMapClick,
    handleCityMapClick,
  } = useGeoMemoViewModel();
  const { downloadExport, downloadMapImage, importFile, importError, lastImportedAt, clearImportError } =
    useVisitDataTransfer();
  const { t } = useI18n();
  const { level, activeProvinceId, activeCityId } = navigation;
  const { visitedCities } = visits;

  useEffect(() => {
    document.title = `${t("app.name")} · ${t("app.title")}`;
  }, [t]);

  const handleMapImageExport = (format: MapImageFormat, pixelRatio: number) => {
    downloadMapImage(mapImageExporter, format, pixelRatio);
  };

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

      <section className="space-y-6">
        <div
          className={`grid gap-4 xl:items-stretch ${
            activeProvinceId ? "xl:grid-cols-[minmax(0,1.75fr)_360px]" : "grid-cols-1"
          }`}
        >
          <div className="xl:h-full">
            {activeProvinceId ? (
              <ProvinceMapView
                provinceId={activeProvinceId}
                activeCityId={activeCityId}
                visitedCities={visitedCities}
                onBack={enterCountry}
                onRegionSelect={handleCityMapClick}
                onExportReady={setMapImageExporter}
                overlay={
                  <div className="flex flex-col items-end gap-3">
                    <MapResetButton onReset={resetCurrentScope} />
                    {activeCityId && activeCityName ? (
                      <MapExperiencePopover
                        regionName={activeCityName}
                        currentExperienceLevel={currentExperienceLevel}
                        isVisited={cityVisited}
                        onSelectLevel={handleExperienceLevelChange}
                        onClear={() => clearCityVisited(activeCityId)}
                      />
                    ) : null}
                  </div>
                }
              />
            ) : (
              <ChinaMapView
                activeProvinceId={activeProvinceId}
                visitedCities={visitedCities}
                onProvinceClick={handleProvinceMapClick}
                onExportReady={setMapImageExporter}
                overlay={<MapResetButton onReset={resetCurrentScope} />}
                fullViewport
              />
            )}
          </div>
          {activeProvinceId ? (
            <div className="xl:flex xl:h-full xl:flex-col">
              <RegionInfoPanel
                level={level}
                activeProvinceId={activeProvinceId}
                activeCityId={activeCityId}
                visitedCities={visitedCities}
                onSelectCity={selectCity}
              />
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
          <ExperienceBreakdownPanel stats={countryStats} layout="horizontal" className="h-full" />
          <DataTransferCard
            importError={importError}
            lastImportedAt={lastImportedAt}
            onExport={downloadExport}
            onExportMapImage={handleMapImageExport}
            canExportMapImage={Boolean(mapImageExporter)}
            onImport={importFile}
            onDismissError={clearImportError}
            layout="horizontal"
            className="h-full"
          />
        </div>
      </section>
    </main>
  );
}
