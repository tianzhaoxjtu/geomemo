# GeoMemo

GeoMemo is a React + TypeScript + Vite + Tailwind CSS app for tracking places visited in China.

## Features

- Stylized China overview map with province-level interaction
- Province drill-down into city-level administrative regions
- Mark city or whole province as visited or unvisited
- Visual differentiation for visited, partially visited, and unvisited regions
- Live statistics for counts and percentages
- `localStorage` persistence via Zustand
- JSON import and export for visited data

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand

## Project Structure

```text
src/
├── app/                 # app bootstrap and global styles
├── entities/
│   ├── region/          # region reference data and indexes
│   └── visit/           # visit domain types and transfer utilities
├── features/
│   ├── map/             # interactive map UI
│   ├── stats/           # selectors and stats presentation
│   └── visit/           # visit-focused hooks and side-panel UI
├── pages/               # page-level composition
└── shared/              # store, shared UI primitives, utilities
```

## Architecture Highlights

- Region data is static reference data and lives in `entities/region`.
- Visit data has its own domain model in `entities/visit`, which prepares the app for backend sync later.
- The store is structured into `navigation`, `visits`, and `ui` domains.
- `useGeoMemoViewModel` keeps page components thin by combining store state with derived selectors.
- Import and export are isolated behind `visitTransfer` utilities so the same contract can later support an API.

## Run Locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
npm run preview
```

## Notes

- The current map uses vendored China GeoJSON files stored under `public/geojson/china`.
- The dataset snapshot is fetched from GeoJSON.CN and versioned locally through `scripts/fetch-geojson.mjs`.
- The data model and store are structured so future backend-driven region data can replace the local snapshot without a major rewrite.
- More architecture details live in [`docs/architecture.md`](./docs/architecture.md) and [`docs/mvp-spec.md`](./docs/mvp-spec.md).
