# GeoMemo Architecture

## Overview

GeoMemo is a local-first React application for tracking places visited in China with authoritative administrative boundary data, drill-down map interaction, bilingual UI, and structured visit metadata.

The current production-facing implementation includes:

- national China map with province boundaries
- province drill-down into city-level administrative regions when available
- visit tracking for cities and province-wide bulk actions
- travel experience levels for visited places
- live statistics derived from one shared store
- bilingual UI in Simplified Chinese and English
- local persistence and JSON import/export

## Technology Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand with `persist`
- Apache ECharts for GeoJSON rendering

## Architecture Principles

- Keep authoritative region data separate from user-owned visit data
- Treat the Zustand store as the single mutable source of truth
- Keep selectors pure and reusable
- Keep components presentational where possible
- Isolate i18n resources, transfer utilities, and map theming from page composition
- Preserve backward compatibility for older persisted visit records

## Current Application Structure

```text
src/
├── app/
│   ├── App.tsx
│   └── styles/
├── entities/
│   ├── region/
│   │   ├── data/
│   │   └── model/
│   └── visit/
│       ├── lib/
│       └── model/
├── features/
│   ├── map/
│   │   ├── components/
│   │   └── lib/
│   ├── stats/
│   │   ├── components/
│   │   └── model/
│   └── visit/
│       ├── components/
│       └── hooks/
├── pages/
│   └── home/
└── shared/
    ├── i18n/
    ├── lib/
    ├── store/
    └── ui/
```

## Layer Responsibilities

### `entities/region`

This layer owns reference data and region identity:

- province and city metadata
- localized region naming helpers
- lookup and index helpers such as `getProvinceById`, `getCityById`, and `getProvinceCities`
- vendored metadata generated from the GeoJSON snapshot

Files of interest:

- [regionIndex.ts](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/entities/region/model/regionIndex.ts)
- [regionNames.ts](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/entities/region/model/regionNames.ts)
- [types.ts](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/entities/region/model/types.ts)

### `entities/visit`

This layer owns the visit domain model and transfer contracts:

- visit entry shape
- history records
- JSON import/export parsing
- backward compatibility for older data that used boolean visit flags

Files of interest:

- [types.ts](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/entities/visit/model/types.ts)
- [visitTransfer.ts](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/entities/visit/lib/visitTransfer.ts)

### `features/map`

This layer owns the interactive geographic UI:

- country map
- province map
- ECharts + GeoJSON integration
- region fill and hover theming
- legend and breadcrumb

It does not own persisted business state.

Files of interest:

- [AdminGeoMap.tsx](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/features/map/components/AdminGeoMap.tsx)
- [ChinaMapView.tsx](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/features/map/components/ChinaMapView.tsx)
- [ProvinceMapView.tsx](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/features/map/components/ProvinceMapView.tsx)
- [mapTheme.ts](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/features/map/lib/mapTheme.ts)

### `features/stats`

This layer owns derived statistics and stat presentation:

- province completion state
- national and province counts
- completion percentages
- experience level breakdowns

Files of interest:

- [statsSelectors.ts](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/features/stats/model/statsSelectors.ts)
- [HeroMetricsPanel.tsx](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/features/stats/components/HeroMetricsPanel.tsx)
- [ExperienceBreakdownPanel.tsx](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/features/stats/components/ExperienceBreakdownPanel.tsx)

### `features/visit`

This layer owns visit-facing UI and composition hooks:

- context panel for province/city selection
- visit actions and experience level selection
- language switcher
- import/export UI
- page-facing hooks that combine store data with selectors

Files of interest:

- [useGeoMemoViewModel.ts](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/features/visit/hooks/useGeoMemoViewModel.ts)
- [VisitActionCard.tsx](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/features/visit/components/VisitActionCard.tsx)
- [RegionInfoPanel.tsx](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/features/visit/components/RegionInfoPanel.tsx)
- [DataTransferCard.tsx](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/features/visit/components/DataTransferCard.tsx)

### `shared/store`

This layer owns the structured Zustand store and persistence behavior.

The store is the only mutable source of truth for:

- navigation state
- visit entries
- visit history
- draft experience level
- import feedback state

File of interest:

- [geoMemoStore.ts](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/shared/store/geoMemoStore.ts)

### `shared/i18n`

This layer owns locale state and translation resources:

- default locale is `zh-CN`
- the selected locale is persisted in `localStorage`
- resources are separate from components

Files of interest:

- [I18nProvider.tsx](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/shared/i18n/I18nProvider.tsx)
- [en.ts](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/shared/i18n/resources/en.ts)
- [zh-CN.ts](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/shared/i18n/resources/zh-CN.ts)

## Data Model

### Region Model

```ts
export type RegionLevel = "country" | "province" | "city";
export type VisitVisualState = "unvisited" | "partial" | "visited";
export type ExperienceLevel = "long" | "medium" | "short";

export interface City {
  id: string;
  code: string;
  name: string;
  fullname: string;
  englishName: string;
  provinceId: string;
}

export interface Province {
  id: string;
  name: string;
  fullname: string;
  englishName: string;
  code: string;
  filename: string;
  cityIds: string[];
}
```

### Visit Model

```ts
export interface VisitEntry {
  experienceLevel: ExperienceLevel;
  visitedAt: string;
  updatedAt?: string;
}

export type VisitedCityMap = Record<string, VisitEntry>;

export interface VisitRecord {
  cityId: string;
  visitedAt: string;
  experienceLevel: ExperienceLevel;
}

export interface VisitsState {
  visitedCities: VisitedCityMap;
  history: VisitRecord[];
}
```

### UI and Navigation Model

```ts
export interface NavigationState {
  level: RegionLevel;
  activeProvinceId: string | null;
  activeCityId: string | null;
}

export interface UIState {
  importError: string | null;
  lastImportedAt: string | null;
  draftExperienceLevel: ExperienceLevel;
}
```

## Single Source of Truth

GeoMemo stores visited state only in `visits.visitedCities`.

Everything else is derived from that:

- province visual state
- country totals
- province totals
- experience level breakdowns
- map fills
- side-panel status

This means:

- clicking the map
- using the right-side visit panel
- importing JSON
- resetting records

all update the same shared state.

## State Management Approach

The app uses Zustand with the `persist` middleware.

Persisted store domains:

- `navigation`
- `visits`
- selected UI preferences needed across reloads, currently `draftExperienceLevel`

The store also includes a migration/normalization path for older persisted data that used:

- `visitedCityIds: Record<string, true>`

Those older records are converted into the current `visitedCities` structure with a default experience level of `short`.

## Store Actions

The main store API currently includes:

- `enterCountry()`
- `enterProvince(provinceId)`
- `selectCity(cityId)`
- `toggleCityVisited(cityId)`
- `setDraftExperienceLevel(level)`
- `setCityExperienceLevel(cityId, level)`
- `setProvinceExperienceLevel(provinceId, level)`
- `markProvinceVisited(provinceId)`
- `clearProvinceVisited(provinceId)`
- `resetAllVisits()`
- `importVisits(raw)`
- `clearImportError()`

## Map Data Handling

GeoMemo uses vendored authoritative GeoJSON data stored locally under:

- `/Users/tianzhaoxjtu/Code/GitHub/geomemo/public/geojson/china`

Supporting metadata is stored under:

- [china-meta.json](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/entities/region/data/china-meta.json)
- [china-regions.json](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/entities/region/data/china-regions.json)
- [china-source.json](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/entities/region/data/china-source.json)

The runtime does not depend on an external map API. ECharts loads local GeoJSON assets and registers them before rendering.

### Drill-Down Logic

Current interaction behavior:

- At country level, clicking a province toggles the province’s visited state and then enters that province.
- At province level, clicking a city selects it and toggles its visited state.
- The province map stays visible while `level = "city"`. City level is a selected-detail state, not a separate map screen.
- Breadcrumbs provide upward navigation.
- Missing city-level geometry is handled gracefully with an empty-state message.

## Experience Level Model

Each visited city stores an `experienceLevel`:

- `long`: more than 6 months
- `medium`: 1 to 6 months
- `short`: less than 1 month

The UI supports:

- choosing a draft experience level before marking a place visited
- updating a selected visited city later
- updating all visited cities in the active province in one action

Province-level experience display is derived from visited city entries rather than persisted as a separate province record.

## Statistics Model

Derived statistics include:

- visited cities
- city completion percentage
- completed provinces
- province completion percentage
- experience level distribution for long, medium, and short stays

The top header uses the national metrics.

The left column below the map shows the national experience distribution.

## Current UI Structure

The current `HomePage` layout is:

1. Hero header
   - title and subtitle
   - subtle atmospheric background
   - language switcher
   - national metrics
2. Breadcrumb row
3. Main two-column layout
   - left: map card, reset overlay action, legend, experience breakdown
   - right: region info panel, visit action panel, import/export panel

The reset action is rendered as a lightweight overlay button inside the map container.

## Data Flow

The high-level flow is:

1. Static region metadata and GeoJSON identifiers come from `entities/region`.
2. User mutations go through `useGeoMemoStore`.
3. `useGeoMemoViewModel` combines store state with selector output.
4. Page components receive already-shaped values and callbacks.
5. Map colors and stat panels are derived from the same visit map.

## Import and Export

Visit data can be exported and re-imported as JSON.

The import/export contract is versioned in the visit transfer utilities. Current exports include:

- `version`
- `exportedAt`
- `visits`

Older imported or persisted boolean visit shapes are still accepted.

## Internationalization

The app currently supports:

- Simplified Chinese
- English

Behavior:

- first visit defaults to Simplified Chinese
- later visits restore the saved locale
- all user-facing copy is translated through resource dictionaries

## Extension Paths

The current structure is ready for:

- backend sync and user accounts
- richer trip metadata per city
- province-level notes or summaries
- AI-generated travel summaries or recommendations
- additional locales
- code splitting and performance optimization around the map bundle
