# GeoMemo Architecture

## Overview

GeoMemo is a frontend-first travel tracker for places visited in China. The current implementation is still local-first, but the structure is now designed to scale toward backend sync, richer travel metadata, and AI-driven features without forcing a rewrite.

The current stack is:

- React + TypeScript
- Vite
- Tailwind CSS
- Zustand with persisted storage

The map currently uses stylized SVG mock geography instead of real GeoJSON. That keeps the interaction loop fast to build while preserving a clean path to real map assets later.

## Architecture Goals

- Keep domain logic separate from UI rendering
- Keep reference data separate from user-owned visit data
- Make selectors and transfer contracts reusable for future APIs
- Keep page components thin by moving composition logic into hooks

## Current Structure

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
    ├── lib/
    ├── store/
    └── ui/
```

## Layer Responsibilities

### `entities/region`

Owns static reference data:

- province and city metadata
- SVG shape/tile geometry
- indexed lookup helpers such as `getProvinceById` and `getCityById`

This layer should be replaceable later with API or GeoJSON-backed data sources.

### `entities/visit`

Owns the visit domain:

- visit state types
- visit history records
- import/export serialization
- JSON parsing and validation

This is the layer that future backend sync or AI summarization should build on.

### `features/map`

Owns map presentation only:

- China overview map
- province detail map
- visual theming and interaction affordances

It should not own persistence or business rules.

### `features/stats`

Owns pure statistics logic:

- province completion
- country totals
- percentages

These selectors are intentionally UI-agnostic.

### `features/visit`

Owns visit-facing UI and page hooks:

- side-panel cards
- import/export controls
- `useGeoMemoViewModel`
- `useVisitDataTransfer`

The main page consumes this layer rather than talking directly to low-level domain modules.

### `shared/store`

Owns the structured Zustand store:

- `navigation`
- `visits`
- `ui`

This keeps mutation logic in one place and makes future slice extraction straightforward.

## Store Shape

```ts
export interface NavigationState {
  level: "country" | "province" | "city";
  activeProvinceId: string | null;
  activeCityId: string | null;
}

export interface VisitRecord {
  cityId: string;
  visitedAt: string;
}

export interface VisitsState {
  visitedCityIds: Record<string, true>;
  history: VisitRecord[];
}

export interface UIState {
  importError: string | null;
  lastImportedAt: string | null;
}

export interface GeoMemoState {
  navigation: NavigationState;
  visits: VisitsState;
  ui: UIState;
}
```

## Why This Is More Production-Ready

### Logic and UI are more clearly separated

- `HomePage` now composes feature modules instead of calculating raw state directly
- selectors stay in `features/stats/model`
- import/export rules stay in `entities/visit/lib`

### The store is structured for growth

The store now models three state domains instead of a single flat object. That makes it easier to:

- add backend sync status
- add optimistic updates
- add auth or user profiles
- split into slices later if needed

### Data contracts are explicit

The app now has typed contracts for:

- region reference data
- visit state
- visit history
- import/export payloads

That makes API integration significantly easier later.

### Transfer flows are isolated

JSON import/export is handled through dedicated transfer utilities and hooks, which means:

- file parsing is testable
- future API sync can reuse the same payload format
- the UI stays simple

## Future Extensions Enabled by This Refactor

- backend persistence and multi-device sync
- multiple travel collections such as `visited`, `wishlist`, or `lived in`
- photos, notes, and trip metadata per city
- AI-generated summaries from visit history
- deeper map data with real province and city geometry
