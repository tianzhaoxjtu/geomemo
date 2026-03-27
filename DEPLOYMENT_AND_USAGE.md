# GeoMemo Deployment and Usage Guide

## Project Overview

GeoMemo is a frontend application for tracking places visited in China on top of authoritative administrative boundary data. It supports province drill-down, second-level administrative-unit tracking, experience levels, bilingual UI, live statistics, and local persistence.

Administrative standard:

- 34 province-level administrative units
- 340 second-level administrative units
- the root China view is not counted as a province

### Key features

- authoritative China province and second-level boundary rendering with ECharts where geometry is available
- click-based drill-down from country to province
- explicit experience-level marking for second-level units and province-wide bulk actions
- travel experience levels: long, medium, short
- live progress metrics and experience distribution
- Simplified Chinese and English UI
- JSON import and export
- PNG/JPEG export for the active map viewport
- local-first persistence with `localStorage`

## Local Development

### Prerequisites

- Node.js 18 or newer recommended
- npm 9 or newer recommended

### Install dependencies

```bash
npm install
npm run validate:admin
```

### Start the development server

```bash
npm run dev
```

Vite will print a local URL, typically:

```text
http://localhost:5173
```

Open that URL in the browser.

## Build and Deployment

### Create a production build

```bash
npm run build
```

This outputs the production bundle to:

```text
dist/
```

### Preview the production build locally

```bash
npm run preview
```

Vite will print a local preview URL, typically:

```text
http://localhost:4173
```

### Recommended deployment target

GeoMemo is a static frontend application, so it is a good fit for:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages with a static hosting workflow

### Vercel deployment

Recommended settings:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

No server runtime or secret configuration is required for the current implementation.

### Static hosting notes

The application depends on local GeoJSON assets under `public/geojson/china`, so make sure the deployment keeps the `public` asset pipeline intact. Standard Vite-compatible static hosting platforms already handle this correctly.

## Usage Guide

### Navigate the map

- The default view is the China map and fills a full-screen section.
- Click a province to enter the province view.
- Use the breadcrumb to return to China.

### Mark visited places

- On the country map, clicking a province enters the province view without changing visit data.
- Inside a province, clicking a second-level unit selects it and opens an inline experience chooser.
- In the right-side panel, selecting an experience level marks or updates the selected unit.
- You can also apply the current level to the active province or clear the active province.

### Set experience levels

- In the inline map chooser or the right-side visit action panel, choose:
  - `Long stay`
  - `Short stay`
  - `Travel`
- If the selected unit is already marked, choosing a level updates it.
- If the unit is unvisited, choosing a level creates the visit entry immediately.
- Clearing is a separate explicit action.

### View statistics

- The header shows four national metrics:
  - visited prefecture-level units
  - prefecture coverage
  - visited provinces
  - province coverage
- The bottom utility row shows the experience level distribution and import/export tools.

### Switch language

- Use the language switcher in the header.
- The app supports Simplified Chinese and English.
- Simplified Chinese is the default language.

### Import and export data

- Use the import/export panel in the bottom utility row.
- `Export JSON` downloads the current visit data.
- `Import JSON` restores visit data from a compatible file.
- `Export map image` downloads the active map as PNG or JPEG, including the current zoom, pan, and visit styling.

### Reset records

- Use the reset button in the top-right corner inside the map card.
- At national level it clears all visit records.
- Inside a province it clears only the current province.

## Data Persistence

GeoMemo uses `localStorage` for client-side persistence.

### What is stored

Main store key:

- `geomemo-store-v1`

Stored data includes:

- current navigation state
- visited second-level unit records
- visit history
- draft experience level

Locale key:

- `geomemo-locale`

Stored locale values:

- `zh-CN`
- `en`

### Compatibility behavior

Older saved data that used a boolean city-visit map is normalized automatically into the current structured visit format.

Legacy ids outside the canonical second-level dataset are filtered out during normalization and import so statistics stay auditable.

## Project Structure

```text
src/
├── app/        # app bootstrap and global styling
├── data/       # canonical province + second-level admin dataset
├── entities/   # domain models and static reference data
├── features/   # map, stats, and visit-oriented UI/features
├── pages/      # page-level layout and composition
└── shared/     # store, i18n, shared UI primitives, utilities
```

### Key modules

- `src/shared/store/geoMemoStore.ts`
  - Zustand store and persistence
- `src/data/adminDivisions/`
  - canonical logical administrative dataset and validation types
- `src/features/visit/hooks/useGeoMemoViewModel.ts`
  - page-facing composition hook
- `src/features/stats/model/statsSelectors.ts`
  - derived metrics and visual-state logic
- `src/features/map/components/AdminGeoMap.tsx`
  - ECharts integration and GeoJSON rendering
- `src/entities/visit/lib/visitTransfer.ts`
  - import/export contracts and normalization
- `src/shared/i18n/`
  - locale state and translation resources

### Dataset validation

Run:

```bash
npm run validate:admin
```

This checks the current province + second-level standard, unit ownership, duplicate ids, and province → unit mapping consistency.

## Future Extensibility

The current structure is ready to grow toward:

- backend synchronization and user accounts
- cloud backups
- per-unit notes, photos, and trip metadata
- richer analytics
- AI-generated travel summaries or recommendations
- additional languages
- performance optimization such as lazy-loading the map bundle
