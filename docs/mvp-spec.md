# GeoMemo Current Product Spec

## Purpose

This document describes the current implemented behavior of GeoMemo. It is intended to serve as the product-level source of truth for ongoing maintenance and future development.

## Product Summary

GeoMemo is a bilingual, local-first travel tracker for China. It uses authoritative administrative boundary data, lets users drill down into provinces, assign experience levels to visited second-level administrative units, and view live progress metrics derived from one shared lower-level visit model.

## Administrative Standard

The implemented logical admin standard is:

- 34 province-level administrative units
- 340 second-level administrative units
- the national/root China node is not counted as a province

Additional rules:

- province-level metrics use only those 34 province-level units
- second-level metrics use the full canonical second-level dataset
- county-level cities, districts, and counties are excluded from statistics
- province coverage is derived from second-level records

## Current Feature Set

### Map and navigation

- national China map with province boundaries
- province drill-down into second-level administrative regions when geometry is available
- breadcrumb navigation from country to province to selected region context
- lightweight inline map interactions

### Visit tracking

- explicit second-level unit marking with one experience level:
  - `long`
  - `medium`
  - `short`
- explicit clear action to return a selected unit to unvisited
- province-wide bulk apply for the current experience level
- province-level clear action
- context-aware reset action

### Statistics

- national header metrics
- experience level distribution in the bottom utility row
- province coverage derived from second-level records
- map coloring driven by derived unit/province coverage

### Persistence and portability

- Zustand store persisted in `localStorage`
- locale persisted separately
- JSON import/export for visit records
- PNG/JPEG export for the active map viewport
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

Large screens use a map-first layout that changes with the current navigation level.

National view:

- full-width, full-viewport China overview map
- embedded legend overlay
- map reset control overlay
- no side panel beside the map

Province view:

- left:
  - province map
  - embedded legend overlay
  - map reset control overlay
  - inline experience popover for the selected unit
- right:
  - `Current Content` panel for the active province

Bottom utility row:

- `Experience Level Distribution`
- `Import / Export Records`

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
- province fill is derived from saved second-level visit records
- clicking a province enters the province view only
- entering a province does not mutate second-level visit state

Province visual-state rules:

- `unvisited`: no visited units in the province
- `partial`: some visited units but not all
- `visited`: all mapped units in the province have saved visit entries

Province coverage metrics use a different rule:

- a province is counted as covered once one or more mapped second-level units in that province are visited

### Province map behavior

- the map renders second-level administrative regions for the active province when geometry exists
- direct-controlled municipalities map district geometry back to one canonical municipality-equivalent record
- Hong Kong, Macao, and Taiwan use directly markable single-unit logical records, so clicking their geometry updates one canonical second-level record per region
- clicking a unit selects it
- selecting a unit opens an inline experience chooser in the map area
- choosing `long`, `medium`, or `short` marks or updates the selected unit immediately
- clearing a unit is a separate explicit action

### Side-panel behavior

The province-level `Current Content` panel mirrors the same source of truth:

- it appears only while a province is active
- it shows second-level unit status within the active province
- visited units display their current experience level label
- selecting a listed unit keeps the province view active and synchronizes with the map selection

### Reset behavior

The reset action is scope-aware:

- at national level, it clears all visits
- inside a province, it clears only mapped second-level units within the active province

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

This second-level visit map drives:

- unit status
- province coverage metrics
- province visual state
- national totals
- experience distribution
- map coloring
- right-side panel badges

No separate persisted province visit flag exists.

### Derived selector responsibilities

Current selectors compute:

- unit visited state
- unit experience level
- province visited count
- province visual state
- province coverage state
- province dominant experience level
- national stats
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
├── Main map section
│   ├── ChinaMapView or ProvinceMapView
│   ├── MapResetButton
│   ├── MapExperiencePopover
│   └── Legend (embedded overlay)
├── Province context rail
│   └── RegionInfoPanel
└── Bottom utility row
    ├── ExperienceBreakdownPanel
    └── DataTransferCard
```

## Map Data Specification

### Logical admin dataset

The application uses a curated logical administrative dataset stored in:

- `/Users/tianzhaoxjtu/Code/GitHub/geomemo/src/data/adminDivisions/china-admin-divisions.json`

### Geographic rendering source

The application uses vendored China administrative GeoJSON data stored in:

- `/Users/tianzhaoxjtu/Code/GitHub/geomemo/public/geojson/china`

### Rendering

- ECharts renders the geographic layers
- local GeoJSON files are registered before rendering
- the runtime does not depend on a remote map API
- the overview map starts from a mainland-focused viewport
- the South China Sea geometry remains in the dataset but is excluded from the default visible focus

### Missing data handling

If second-level geometry is missing for a province, the UI shows an empty state instead of failing.

### Validation

Run:

```bash
npm run validate:admin
```

This verifies the province + second-level standard and the internal province → unit mapping.

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

- map, panel, and statistics must continue to read from the same second-level visit data
- province-level coverage must remain derived from second-level records
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
