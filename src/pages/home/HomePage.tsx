import { BreadcrumbNav } from "../../features/map/components/BreadcrumbNav";
import { ChinaMapView } from "../../features/map/components/ChinaMapView";
import { Legend } from "../../features/map/components/Legend";
import { ProvinceMapView } from "../../features/map/components/ProvinceMapView";
import { StatsPanel } from "../../features/stats/components/StatsPanel";
import { DataTransferCard } from "../../features/visit/components/DataTransferCard";
import { RegionInfoPanel } from "../../features/visit/components/RegionInfoPanel";
import { VisitActionCard } from "../../features/visit/components/VisitActionCard";
import { VisitedSummaryCard } from "../../features/visit/components/VisitedSummaryCard";
import { useGeoMemoViewModel } from "../../features/visit/hooks/useGeoMemoViewModel";
import { useVisitDataTransfer } from "../../features/visit/hooks/useVisitDataTransfer";

export function HomePage() {
  const {
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
    activeProvinceName,
    activeCityName,
    countryStats,
    provinceStats,
    cityVisited,
  } = useGeoMemoViewModel();
  const { downloadExport, importFile, importError, lastImportedAt, clearImportError } =
    useVisitDataTransfer();
  const { level, activeProvinceId, activeCityId } = navigation;
  const { visitedCityIds } = visits;

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <header className="surface-card fade-in-up mb-8 overflow-hidden px-6 py-7 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-sky-200/30 via-white/0 to-amber-200/25" />
        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              GeoMemo
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Track the places you have visited in China
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              A functional MVP with province drill-down, city-level visit tracking, live statistics,
              and local persistence.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricPill
              label="Cities visited"
              value={`${countryStats.visitedCities}`}
              sublabel={`of ${countryStats.totalCities}`}
            />
            <MetricPill
              label="Coverage"
              value={`${countryStats.cityVisitPercentage}%`}
              sublabel="city completion"
            />
            <MetricPill
              label="Completed provinces"
              value={`${countryStats.visitedProvinces}`}
              sublabel={`of ${countryStats.totalProvinces}`}
            />
          </div>
        </div>
        <div className="relative mt-6 flex flex-wrap gap-3">
          <button
            className="glass-button"
            onClick={() => {
              clearSelectedCity();
              if (activeProvinceId) {
                enterProvince(activeProvinceId);
              }
            }}
          >
            Clear selection
          </button>
          <button
            className="primary-button"
            onClick={resetAllVisits}
          >
            Reset visits
          </button>
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
              visitedCityIds={visitedCityIds}
              onBack={enterCountry}
              onCityClick={selectCity}
            />
          ) : (
            <ChinaMapView
              activeProvinceId={activeProvinceId}
              visitedCityIds={visitedCityIds}
              onProvinceClick={enterProvince}
            />
          )}
          <Legend />
        </div>

        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <StatsPanel title="National statistics" stats={countryStats} />
          {provinceStats ? <StatsPanel title={`${activeProvinceName} statistics`} stats={provinceStats} /> : null}
          <DataTransferCard
            importError={importError}
            lastImportedAt={lastImportedAt}
            onExport={downloadExport}
            onImport={importFile}
            onDismissError={clearImportError}
          />
          <VisitedSummaryCard visitedCityIds={visitedCityIds} />
          <RegionInfoPanel
            level={level}
            activeProvinceId={activeProvinceId}
            activeCityId={activeCityId}
            visitedCityIds={visitedCityIds}
            onSelectCity={selectCity}
          />
          <VisitActionCard
            hasProvince={Boolean(activeProvinceId)}
            cityName={activeCityName}
            isCityVisited={cityVisited}
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
        </aside>
      </section>
    </main>
  );
}

function MetricPill({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel: string;
}) {
  return (
    <div className="metric-pill min-w-[160px]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{sublabel}</p>
    </div>
  );
}
