# GeoMemo Phase 1 MVP Technical Spec

## Goal

Ship a polished single-page application that allows the user to:

- view a China map
- drill down into a province
- select a city
- mark that city as visited
- see province and country statistics update immediately
- retain visit data in `localStorage`

This phase should favor clean structure and reliable interaction over breadth of features.

## Phase 1 Scope

### Included

- Single-page app
- China map at national level
- Province-level map drill-down
- City selection inside a province
- Visited tracking at city level
- Computed visual states for provinces
- Country and province statistics
- Breadcrumb navigation
- Local persistence with `localStorage`
- Premium Apple-inspired visual design

### Excluded

- authentication
- backend sync
- notes and photos
- search
- filters
- deep-link routing
- multiple visit categories

## Page Layout

Use one route: `HomePage`.

### Desktop Layout

- top header bar
- large central map stage
- right-side floating panel for details and statistics
- compact legend overlay near the map

### Mobile Layout

- top header
- map as the first block
- bottom sheet or stacked card panel for context and actions
- breadcrumb always visible above map or at top of detail panel

## Layout Zones

### 1. HeaderBar

Contains:

- app name: `GeoMemo`
- short subtitle
- optional reset action
- optional future settings trigger

### 2. MapWorkspace

Contains:

- current map view
- hover and selected state feedback
- smooth level transitions

This is the visual focal point of the page.

### 3. SidePanel

Context-sensitive content:

- country summary when level is `country`
- province summary when level is `province`
- city detail and visit action when level is `city`

### 4. BreadcrumbNav

Examples:

- `China`
- `China / Sichuan`
- `China / Sichuan / Chengdu`

The last item reflects the current navigation state.

### 5. Legend

States:

- `Visited`
- `Partially visited`
- `Unvisited`

## Drill-Down Interaction Flow

This flow should be consistent and deterministic.

### Initial State

```ts
{
  level: "country",
  activeProvinceId: null,
  activeCityId: null
}
```

### Country Level Behavior

Map displays provinces.

On province hover:

- highlight province
- optionally show tooltip with province name and completion

On province click:

- set `activeProvinceId`
- clear `activeCityId`
- set `level = "province"`
- render selected province map
- update breadcrumb
- update side panel to province summary

### Province Level Behavior

Map displays cities for the active province.

On city hover:

- highlight city
- optionally show tooltip with city name

On city click:

- set `activeCityId`
- keep `activeProvinceId`
- set `level = "city"`
- update side panel to city detail

### City Level Behavior

For Phase 1, city level is a selected-detail state, not a separate geographic map screen.

The province map remains visible while:

- selected city is highlighted
- side panel shows city name and visit action

On toggle visited:

- update city visit state
- recompute province visual state
- recompute country stats
- persist state

### Back Navigation

From `city` to `province`:

- click breadcrumb province
- or close city detail state

From `province` to `country`:

- click breadcrumb `China`
- or use back control

## State Management

Use Zustand with `persist`.

### Source of Truth

Visited state is stored only at the city level.

Province status is derived from city completion:

- `unvisited`: zero visited cities
- `visited`: all cities visited
- `partial`: some but not all cities visited

### Persisted Data

- `visitedCityIds`
- optionally navigation context

### Transient Data

- hover state
- tooltip state
- transition state
- temporary panel behavior

## Store API

The store should expose a small intent-based API.

```ts
export type RegionLevel = "country" | "province" | "city";
export type VisitVisualState = "unvisited" | "partial" | "visited";

export interface City {
  id: string;
  code: string;
  name: string;
  provinceId: string;
  centroid?: [number, number];
}

export interface Province {
  id: string;
  code: string;
  name: string;
  cityIds: string[];
  centroid?: [number, number];
}

export interface ChinaRegionIndex {
  provinces: Record<string, Province>;
  cities: Record<string, City>;
  provinceOrder: string[];
}

export interface VisitState {
  visitedCityIds: Record<string, true>;
}

export interface NavigationState {
  level: RegionLevel;
  activeProvinceId: string | null;
  activeCityId: string | null;
}

export interface UIState {
  hoveredProvinceId: string | null;
  hoveredCityId: string | null;
  isSidePanelOpen: boolean;
}

export interface GeoMemoStoreState {
  navigation: NavigationState;
  visits: VisitState;
  ui: UIState;
}

export interface GeoMemoStoreActions {
  enterCountry: () => void;
  enterProvince: (provinceId: string) => void;
  selectCity: (cityId: string) => void;
  clearSelectedCity: () => void;

  toggleCityVisited: (cityId: string) => void;
  markCityVisited: (cityId: string) => void;
  markCityUnvisited: (cityId: string) => void;

  markProvinceVisited: (provinceId: string) => void;
  clearProvinceVisited: (provinceId: string) => void;

  setHoveredProvince: (provinceId: string | null) => void;
  setHoveredCity: (cityId: string | null) => void;

  resetAllVisits: () => void;
}

export type GeoMemoStore = GeoMemoStoreState & GeoMemoStoreActions;
```

## Store Behavior Contract

### `enterCountry()`

- set `level = "country"`
- set `activeProvinceId = null`
- set `activeCityId = null`

### `enterProvince(provinceId)`

- set `level = "province"`
- set `activeProvinceId = provinceId`
- set `activeCityId = null`

### `selectCity(cityId)`

- derive province from city metadata
- set `activeProvinceId = city.provinceId`
- set `activeCityId = cityId`
- set `level = "city"`

### `clearSelectedCity()`

- set `activeCityId = null`
- if `activeProvinceId` exists, set `level = "province"`

### `toggleCityVisited(cityId)`

- if city is visited, remove it
- otherwise mark it visited
- recompute all selectors automatically from state

### `markProvinceVisited(provinceId)`

- mark all cities in the province as visited

### `clearProvinceVisited(provinceId)`

- clear all visited cities in the province

## Selectors and Statistics Logic

Selectors should be pure and independent from UI components.

### Required Selectors

- `isCityVisited(cityId, state)`
- `getVisitedCityCount(state, regionIndex)`
- `getTotalCityCount(regionIndex)`
- `getProvinceVisitedCityCount(provinceId, state, regionIndex)`
- `getProvinceVisualState(provinceId, state, regionIndex)`
- `getVisitedProvinceCount(state, regionIndex)`
- `getCountryStats(state, regionIndex)`
- `getProvinceStats(provinceId, state, regionIndex)`

### Statistics Output

```ts
export interface RegionStats {
  totalCities: number;
  visitedCities: number;
  cityVisitPercentage: number;
  totalProvinces?: number;
  visitedProvinces?: number;
  provinceVisitPercentage?: number;
}
```

## Map Module

The map feature should be isolated behind a small adapter layer.

### Responsibilities

- register GeoJSON assets
- render the active map
- apply visited-state colors
- map click events to domain ids
- format map tooltips

### Internal Parts

- `MapController`
- `ChinaMapView`
- `ProvinceMapView`
- `echartsAdapter`
- `mapRegistry`
- `mapThemeAdapter`
- `mapTooltipAdapter`

### Input Contract

The map should receive computed view models rather than raw store state where possible.

```ts
export interface MapRegionViewModel {
  id: string;
  name: string;
  level: "province" | "city";
  visualState: VisitVisualState;
  isActive: boolean;
  isHovered: boolean;
  visitedCount?: number;
  totalCount?: number;
}
```

## UI Module

### Core Components

- `HeaderBar`
- `BreadcrumbNav`
- `StatsPanel`
- `RegionInfoPanel`
- `VisitActionCard`
- `Legend`
- `ProgressSummaryCard`
- `GlassPanel`

### Presentation Rules

- components should remain mostly presentational
- selectors should compute statistics and completion state
- map styling should come from a theme adapter, not inline conditionals throughout the UI

## Component Tree

```text
App
└── AppShell
    └── HomePage
        ├── HeaderBar
        ├── BreadcrumbNav
        ├── GeoMemoLayout
        │   ├── MapWorkspace
        │   │   └── MapController
        │   │       ├── ChinaMapView
        │   │       └── ProvinceMapView
        │   └── SidePanel
        │       ├── StatsPanel
        │       ├── RegionInfoPanel
        │       └── VisitActionCard
        └── Legend
```

## File and Module Structure

```text
src/
├── app/
│   ├── App.tsx
│   ├── main.tsx
│   ├── providers/
│   │   └── StoreProvider.tsx
│   └── styles/
│       ├── globals.css
│       └── tokens.css
├── pages/
│   └── home/
│       └── HomePage.tsx
├── entities/
│   └── region/
│       ├── data/
│       │   ├── provinces.ts
│       │   ├── cities.ts
│       │   └── geojson/
│       ├── model/
│       │   ├── types.ts
│       │   ├── regionIndex.ts
│       │   └── regionSelectors.ts
│       └── lib/
│           └── regionLookup.ts
├── features/
│   ├── map/
│   │   ├── components/
│   │   │   ├── MapController.tsx
│   │   │   ├── ChinaMapView.tsx
│   │   │   ├── ProvinceMapView.tsx
│   │   │   └── BreadcrumbNav.tsx
│   │   ├── lib/
│   │   │   ├── echartsAdapter.ts
│   │   │   ├── mapRegistry.ts
│   │   │   ├── mapThemeAdapter.ts
│   │   │   └── mapTooltipAdapter.ts
│   │   └── model/
│   │       └── mapViewModel.ts
│   ├── visit/
│   │   ├── components/
│   │   │   ├── RegionInfoPanel.tsx
│   │   │   └── VisitActionCard.tsx
│   │   └── model/
│   │       └── visitSelectors.ts
│   └── stats/
│       ├── components/
│       │   ├── StatsPanel.tsx
│       │   └── ProgressSummaryCard.tsx
│       └── model/
│           ├── statsSelectors.ts
│           └── statsFormatters.ts
├── shared/
│   ├── store/
│   │   ├── geoMemoStore.ts
│   │   ├── persistence.ts
│   │   └── slices/
│   │       ├── navigationSlice.ts
│   │       ├── visitSlice.ts
│   │       └── uiSlice.ts
│   ├── ui/
│   │   ├── Card.tsx
│   │   ├── GlassPanel.tsx
│   │   ├── IconButton.tsx
│   │   └── StatBadge.tsx
│   └── lib/
│       ├── constants.ts
│       ├── percent.ts
│       └── storageKeys.ts
└── docs/
    ├── architecture.md
    └── mvp-spec.md
```

## Premium UI Direction

The MVP should feel calm, intentional, and premium.

### Visual Style

- bright neutral surfaces
- subtle gradients in the page background
- translucent side panel
- low-contrast borders
- generous spacing
- rounded card geometry

### State Colors

- visited: refined blue-green
- partial: muted amber or sand
- unvisited: soft neutral gray

### Motion

- map transitions: subtle and quick
- panel transitions: fade and slide
- selection states: restrained highlight, not loud animation

## Acceptance Criteria

Phase 1 is considered complete when:

- the user can drill from China to a province
- the user can select a city within that province
- the user can mark the city as visited or unvisited
- province coloring updates correctly
- national statistics update immediately
- data persists after reload
- breadcrumb navigation works in both directions
- the app remains usable on desktop and mobile

## Recommended Implementation Order

1. region data and types
2. store and persistence
3. selectors and statistics
4. country map
5. province map
6. side panel and visit actions
7. breadcrumb navigation
8. motion and visual polish
