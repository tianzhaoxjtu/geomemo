# GeoMemo Current Product Spec

## Purpose

This document describes the current implemented behavior of GeoMemo. It is intended to serve as the working product spec for future development and should stay aligned with the codebase.

## Product Summary

GeoMemo is a bilingual, local-first travel tracker for China. It lets users explore authoritative administrative boundaries, mark places as visited, assign a travel experience level, and view derived progress statistics.

## Current Feature Set

### Core map interaction

- country-level China map using province boundaries
- province drill-down into city-level administrative regions when available
- breadcrumb-based upward navigation
- direct map interaction for visit updates

### Visit tracking

- toggle city visited/unvisited
- toggle a whole province visited/unvisited from the country map
- mark all cities in the active province visited
- clear all visits in the active province
- reset all records

### Experience levels

- each visited city stores one experience level
- supported levels:
  - `long`: more than 6 months
  - `medium`: 1 to 6 months
  - `short`: less than 1 month
- users can change the level after the place is already marked visited

### Statistics

- national metrics in the hero header
- experience level distribution below the map
- derived counts and percentages

### Data portability

- JSON export
- JSON import
- backward-compatible parsing for older saved data

### Internationalization

- Simplified Chinese
- English
- Simplified Chinese as default
- persisted locale selection

## Current Page Layout

### Header

The hero header contains:

- app title
- app subtitle
- language switcher
- four national metrics

The header background uses a subtle atmospheric treatment with gradients and soft blurred shapes.

### Breadcrumb

A breadcrumb row sits below the header:

- `China`
- `China / Province`
- `China / Province / City`

### Main content

The page uses a two-column layout on large screens.

Left column:

- country or province map
- map legend
- experience level distribution

Right column:

- region context panel
- visit action panel
- import/export panel

## Current Interaction Logic

### Initial state

```ts
{
  navigation: {
    level: "country",
    activeProvinceId: null,
    activeCityId: null
  },
  visits: {
    visitedCities: {},
    history: []
  },
  ui: {
    importError: null,
    lastImportedAt: null,
    draftExperienceLevel: "short"
  }
}
```

### Country map behavior

- the country map renders provinces
- each province fill is derived from visited city data
- clicking a province:
  - toggles province-level visited state
  - enters the province drill-down view

Province visual state rules:

- `unvisited`: zero visited cities
- `partial`: some visited cities but not all
- `visited`: all cities visited

### Province map behavior

- the province map renders city-level administrative regions for the active province when geometry exists
- clicking a city:
  - selects the city
  - toggles visited/unvisited immediately
- the selected city is reflected in the side panel

### City selection behavior

`level = "city"` is a detail-selection state, not a separate map route. The province map remains visible while the side panel focuses on the selected city.

### Experience level behavior

- the visit action panel exposes the three experience levels
- if a selected city is already visited, changing the level updates that city
- if an active province has visited cities and no visited city is selected, changing the level updates all visited cities in that province
- otherwise, the selected level becomes the draft level used for the next visit action

### Reset behavior

- the reset action appears as an overlay button inside the map card
- clicking it clears all visits and resets navigation

## State and Data Flow

GeoMemo uses one shared Zustand store. All user-visible state changes flow through that store.

### Single source of truth

The canonical visit state is:

```ts
type VisitedCityMap = Record<string, VisitEntry>;
```

Where:

```ts
interface VisitEntry {
  experienceLevel: "long" | "medium" | "short";
  visitedAt: string;
  updatedAt?: string;
}
```

Everything else is derived from this structure:

- province completion state
- country totals
- province totals
- map coloring
- experience distribution
- panel badges

### Derived selectors

Current selectors compute:

- city visited state
- city experience level
- province visual state
- province dominant experience level
- national stats
- province stats
- experience level breakdown

### View-model layer

`useGeoMemoViewModel` is the page composition boundary. It:

- reads store slices
- applies region lookup helpers
- applies localized name helpers
- computes national and province stats
- exposes stable values and callbacks to `HomePage`

## Current Component Structure

```text
HomePage
├── Header
│   ├── LanguageSwitcher
│   └── HeroMetricsPanel
├── BreadcrumbNav
├── Left column
│   ├── ChinaMapView or ProvinceMapView
│   ├── MapResetButton
│   ├── Legend
│   └── ExperienceBreakdownPanel
└── Right column
    ├── RegionInfoPanel
    ├── VisitActionCard
    └── DataTransferCard
```

## Map Data Specification

### Source

The application uses vendored China administrative GeoJSON data recorded in:

- `/Users/tianzhaoxjtu/Code/GitHub/geomemo/public/geojson/china`

The source snapshot metadata is tracked in:

- [china-source.json](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/entities/region/data/china-source.json)

### Rendering

- ECharts renders the geographic layers
- local GeoJSON files are registered before rendering
- no runtime dependence on a remote map API

### Missing data handling

If city-level geometry is not available for a province, the province map renders a user-facing empty state instead of failing.

## Persistence Specification

### Local storage

The application persists its main store under:

- `geomemo-store-v1`

The persisted payload currently includes:

- navigation
- visits
- `ui.draftExperienceLevel`

The locale is stored separately under:

- `geomemo-locale`

### Backward compatibility

Older persisted or imported data using `visitedCityIds: Record<string, true>` is normalized into the current `visitedCities` model with the default experience level `short`.

## Import/Export Specification

Current export shape:

```ts
interface GeoMemoExportPayload {
  version: 2;
  exportedAt: string;
  visits: VisitsState;
}
```

Import rules:

- accepts current exports
- accepts direct visit-state payloads
- accepts the older boolean visit map shape
- validates JSON structure before applying data

## UI Behavior Requirements for Future Changes

Future UI changes should preserve these guarantees:

- map and side panel always reflect the same visit state
- statistics are always derived, never manually duplicated
- experience level state remains synchronized across map, panel, and stats
- i18n text remains externalized
- authoritative map data remains local and maintainable

## Non-Goals in the Current Version

These are not implemented yet:

- authentication
- backend sync
- search
- notes and photos
- route-based deep linking
- multi-user collaboration
- AI-generated recommendations
