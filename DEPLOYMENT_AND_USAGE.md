# GeoMemo Deployment and Usage Guide

## Project Overview

GeoMemo is a frontend application for tracking places visited in China on top of authoritative administrative boundary data. It supports province drill-down, city-level visit tracking, experience levels, bilingual UI, live statistics, and local persistence.

### Key features

- authoritative China province and city boundary rendering with ECharts
- click-based drill-down from country to province
- visited and unvisited tracking for cities and provinces
- travel experience levels: long, medium, short
- live progress metrics and experience distribution
- Simplified Chinese and English UI
- JSON import and export
- local-first persistence with `localStorage`

## Local Development

### Prerequisites

- Node.js 18 or newer recommended
- npm 9 or newer recommended

### Install dependencies

```bash
npm install
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

- The default view is the China map.
- Click a province to enter the province view.
- Use the breadcrumb to return to China.

### Mark visited places

- On the country map, clicking a province toggles the province-wide visited state and opens that province.
- Inside a province, clicking a city selects it and toggles visited or unvisited immediately.
- In the right-side panel, you can also mark or clear the active province.

### Set experience levels

- In the right-side visit action panel, choose:
  - `Long stay`
  - `Short stay`
  - `Travel`
- If the selected city is already visited, changing the level updates that city.
- If no visited city is selected but the active province contains visited cities, the level change updates visited cities in that province.
- Otherwise, the selected level becomes the default for the next new visit action.

### View statistics

- The header shows four national metrics:
  - visited cities
  - city coverage
  - completed provinces
  - province coverage
- The area below the map shows the experience level distribution.

### Switch language

- Use the language switcher in the header.
- The app supports Simplified Chinese and English.
- Simplified Chinese is the default language.

### Import and export data

- Use the import/export panel in the right sidebar.
- `Export JSON` downloads the current visit data.
- `Import JSON` restores visit data from a compatible file.

### Reset records

- Use the reset button in the top-right corner inside the map card.
- This clears all visit records and returns the app to the default navigation state.

## Data Persistence

GeoMemo uses `localStorage` for client-side persistence.

### What is stored

Main store key:

- `geomemo-store-v1`

Stored data includes:

- current navigation state
- visited city records
- visit history
- draft experience level

Locale key:

- `geomemo-locale`

Stored locale values:

- `zh-CN`
- `en`

### Compatibility behavior

Older saved data that used a boolean city-visit map is normalized automatically into the current structured visit format.

## Project Structure

```text
src/
├── app/        # app bootstrap and global styling
├── entities/   # domain models and static reference data
├── features/   # map, stats, and visit-oriented UI/features
├── pages/      # page-level layout and composition
└── shared/     # store, i18n, shared UI primitives, utilities
```

### Key modules

- `src/shared/store/geoMemoStore.ts`
  - Zustand store and persistence
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

## Future Extensibility

The current structure is ready to grow toward:

- backend synchronization and user accounts
- cloud backups
- per-city notes, photos, and trip metadata
- richer analytics
- AI-generated travel summaries or recommendations
- additional languages
- performance optimization such as lazy-loading the map bundle
