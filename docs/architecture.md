# GeoMemo Architecture

## Overview

GeoMemo is a local-first React application for tracking places visited in China with authoritative administrative boundary data, drill-down map interaction, bilingual UI, and structured visit metadata.

The current production-facing implementation includes:

- national China map with province boundaries
- province drill-down into second-level administrative regions when available
- visit tracking for second-level units and province-wide bulk actions
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
├── data/
│   └── adminDivisions/
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

### `data/adminDivisions`

This layer owns the canonical logical administrative standard used throughout the app:

- 34 province-level administrative units
- 334 second-level administrative units
- explicit province → prefecture mapping
- province type and map drill-down metadata

Files of interest:

- [china-admin-divisions.json](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/data/adminDivisions/china-admin-divisions.json)
- [index.ts](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/data/adminDivisions/index.ts)
- [types.ts](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/data/adminDivisions/types.ts)

### `entities/region`

This layer owns reference data and region identity:

- province and second-level metadata normalized from the canonical admin dataset
- localized region naming helpers
- lookup and index helpers such as `getProvinceById`, `getCityById`, and `getProvinceCities`
- the bridge between logical administrative data and UI-facing region models

Internal naming note:

- The codebase retains `City`, `getCityById`, and `visitedCities` as compatibility-friendly internal names.
- Those names now refer to the app's canonical second-level administrative units rather than only prefecture-level cities.

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

- context panel for province/second-level selection
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
export type ProvinceType = "province" | "municipality" | "autonomous-region" | "sar" | "taiwan";
export type ProvinceMapDrillDownMode = "prefecture" | "single-city" | "unavailable";

export interface City {
  id: string;
  code: string;
  name: string;
  fullname: string;
  englishName: string;
  provinceId: string;
  administrativeLevel: "prefecture";
}

export interface Province {
  id: string;
  name: string;
  fullname: string;
  englishName: string;
  code: string;
  filename: string;
  type: ProvinceType;
  mapDrillDownMode: ProvinceMapDrillDownMode;
  cityIds: string[];
}
```

### Administrative Counting Rules

- Province totals always use the 34 province-level units from `src/data/adminDivisions/china-admin-divisions.json`.
- Second-level totals always use the 334 canonical units from the same dataset.
- The second-level layer includes prefecture-level cities, autonomous prefectures, leagues, and prefectures, plus one municipality-equivalent record for each direct-controlled municipality.
- The national/root China node is never included in province metrics.
- County-level cities, districts, counties, and other lower-level units are excluded from statistics.
- Province coverage is derived from second-level visit entries: a province counts as visited once any canonical unit in it is visited.

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
- province coverage metrics
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
- `markCityVisited(cityId, level)`
- `clearCityVisited(cityId)`
- `setDraftExperienceLevel(level)`
- `markProvinceVisited(provinceId, level?)`
- `clearProvinceVisited(provinceId)`
- `resetCurrentScope()`
- `resetAllVisits()`
- `importVisits(raw)`
- `clearImportError()`

## Map Data Handling

GeoMemo separates logical administrative data from geographic rendering data.

Logical source of truth:

- [china-admin-divisions.json](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/data/adminDivisions/china-admin-divisions.json)

Geographic rendering data:

- `/Users/tianzhaoxjtu/Code/GitHub/geomemo/public/geojson/china`

The runtime does not depend on an external map API. ECharts loads local GeoJSON assets and registers them before rendering.

### Drill-Down Logic

Current interaction behavior:

- At country level, clicking a province enters that province without mutating visit state.
- At province level, clicking a second-level unit selects it and opens the experience-level chooser.
- Direct-controlled municipalities map district geometry back to one canonical municipality-equivalent record so they still fit the shared second-level interaction model.
- Taiwan, Hong Kong, and Macau remain in the 34-province layer but currently expose no editable second-level travel units in the chosen logical standard.
- The province map stays visible while `level = "city"`. City level is a selected-detail state, not a separate map screen.
- Breadcrumbs provide upward navigation.
- Missing second-level geometry is handled gracefully with an empty-state message.

## Validation and Audit

Run the administrative dataset validator with:

```bash
npm run validate:admin
```

The validator checks:

- province count equals 34
- second-level unit count equals 334
- every second-level unit belongs to exactly one valid province
- duplicate ids and duplicate province names
- exclusion of the root China node from province totals
- province → second-level mapping consistency

## Experience Level Model

Each visited second-level unit stores an `experienceLevel`:

- `long`: more than 6 months
- `medium`: 1 to 6 months
- `short`: less than 1 month

The UI supports:

- choosing an experience level from the side panel or inline map popover
- creating or updating a selected unit visit with one explicit level selection
- clearing a selected unit back to unvisited
- updating all mapped second-level units in the active province in one action

Province-level experience display is derived from visited second-level entries rather than persisted as a separate province record.

## Statistics Model

Derived statistics include:

- visited second-level units
- second-level completion percentage
- visited provinces
- province completion percentage
- experience level distribution for long, medium, and short stays

The top header uses the national metrics.

The left column below the map shows the national experience distribution.

Province coverage metrics are derived using the rule:

- a province counts as visited once any second-level unit in that province has a saved visit entry

The map still distinguishes `partial` versus fully visited provinces visually.

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
- richer trip metadata per second-level unit
- province-level notes or summaries
- AI-generated travel summaries or recommendations
- additional locales
- code splitting and performance optimization around the map bundle
