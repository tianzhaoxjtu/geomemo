# GeoMemo Current Product Spec

## Purpose

This document describes the current implemented behavior of GeoMemo. It is intended to serve as the product-level source of truth for ongoing maintenance and future development.

## Product Summary

GeoMemo is a bilingual, local-first travel tracker for China. It uses authoritative administrative boundary data, lets users drill down into provinces, assign experience levels to visited cities, and view live progress metrics derived from a single city-level visit model.

## Current Feature Set

### Map and navigation

- national China map with province boundaries
- province drill-down into city-level administrative regions when geometry is available
- breadcrumb navigation from country to province to selected city context
- lightweight inline map interactions

### Visit tracking

- explicit city marking with one experience level:
  - `long`
  - `medium`
  - `short`
- explicit clear action to return a city to unvisited
- province-wide bulk apply for the current experience level
- province-level clear action
- context-aware reset action

### Statistics

- national header metrics
- experience level distribution below the map
- province coverage derived from city-level records
- map coloring driven by derived city/province state

### Persistence and portability

- Zustand store persisted in `localStorage`
- locale persisted separately
- JSON import/export for visit records
- backward compatibility for older boolean visit data

### Internationalization

- Simplified Chinese
- English
- Simplified Chinese default
- immediate runtime switching

## Current Page Layout

### Hero header

Contains:

- app title
- subtitle
- language switcher
- four national metrics

### Breadcrumb row

Displays the current navigation path:

- `China`
- `China / Province`
- `China / Province / City`

### Main content

Large screens use a two-column layout.

Left column:

- country or province map
- map reset control overlay
- legend
- experience level distribution

Right column:

- region context panel
- travel record action panel
- import/export panel

## Current Interaction Flow

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

- the map renders provinces
- province fill is derived from saved city visit records
- clicking a province enters the province view only
- entering a province does not mutate city visit state

Province visual-state rules:

- `unvisited`: no visited cities in the province
- `partial`: some visited cities but not all
- `visited`: all cities in the province have saved visit entries

Province coverage metrics use a different rule:

- a province is counted as covered once one or more cities in that province are visited

### Province map behavior

- the map renders city-level administrative regions for the active province when geometry exists
- clicking a city selects it
- selecting a city opens an inline experience chooser in the map area
- choosing `long`, `medium`, or `short` marks or updates the selected city immediately
- clearing a city is a separate explicit action

### Side-panel behavior

The right-side panel mirrors the same source of truth:

- the region panel shows city status within the active province
- visited cities display their current experience level label
- the action panel lets the user:
  - set the selected city’s experience level
  - clear the selected city
  - apply the current level to the whole active province
  - clear the active province

### Reset behavior

The reset action is scope-aware:

- at national level, it clears all visits
- inside a province, it clears only cities within the active province

## Data Model

### Region model

```ts
type RegionLevel = "country" | "province" | "city";
type VisitVisualState = "unvisited" | "partial" | "visited";
type ExperienceLevel = "long" | "medium" | "short";
```

### Visit model

```ts
interface VisitEntry {
  experienceLevel: ExperienceLevel;
  visitedAt: string;
  updatedAt?: string;
}

type VisitedCityMap = Record<string, VisitEntry>;

interface VisitRecord {
  cityId: string;
  visitedAt: string;
  experienceLevel: ExperienceLevel;
}
```

## State and Data Flow

GeoMemo uses a single shared Zustand store.

### Canonical source of truth

The canonical visit state is:

```ts
visits.visitedCities
```

This city-level map drives:

- city status
- province coverage metrics
- province visual state
- national totals
- experience distribution
- map coloring
- right-side panel badges

No separate persisted province visit flag exists.

### Derived selector responsibilities

Current selectors compute:

- city visited state
- city experience level
- province visited count
- province visual state
- province coverage state
- province dominant experience level
- national stats
- province stats
- experience level distribution

### View-model boundary

`useGeoMemoViewModel` acts as the composition boundary between raw store state and the page:

- reads navigation, visit, and UI state
- localizes active region names
- computes derived stats
- exposes view-ready handlers for map and panel interactions

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
│   ├── MapExperiencePopover
│   ├── Legend
│   └── ExperienceBreakdownPanel
└── Right column
    ├── RegionInfoPanel
    ├── VisitActionCard
    └── DataTransferCard
```

## Map Data Specification

### Source

The application uses vendored China administrative GeoJSON data stored in:

- `/Users/tianzhaoxjtu/Code/GitHub/geomemo/public/geojson/china`

Supporting metadata is tracked in:

- [china-source.json](/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/entities/region/data/china-source.json)

### Rendering

- ECharts renders the geographic layers
- local GeoJSON files are registered before rendering
- the runtime does not depend on a remote map API

### Missing data handling

If city-level geometry is missing for a province, the UI shows an empty state instead of failing.

## Persistence Specification

### Local storage

Main store key:

- `geomemo-store-v1`

Locale key:

- `geomemo-locale`

Persisted data includes:

- navigation
- visits
- `ui.draftExperienceLevel`

### Compatibility behavior

Older persisted or imported data using `visitedCityIds: Record<string, true>` is normalized into the current `visitedCities` structure with default level `short`.

## Import/Export Specification

Current export shape:

```ts
interface GeoMemoExportPayload {
  version: 2;
  exportedAt: string;
  visits: VisitsState;
}
```

Import accepts:

- current exports
- direct visit-state payloads
- the older boolean visit map shape

## Guarantees Future Changes Should Preserve

- map, panel, and statistics must continue to read from the same city-level visit data
- province-level coverage must remain derived from city-level records
- entering a province must not mutate visit state
- experience-level marking remains explicit, not binary toggle-based
- i18n text stays externalized
- authoritative map data remains vendored and maintainable

## Current Non-Goals

These are not implemented in v1:

- authentication
- backend sync
- search
- notes and photos
- route-based deep linking
- multi-user collaboration
- AI-generated recommendations
