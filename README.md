# GeoMemo

GeoMemo is a React + TypeScript + Vite application for tracking places visited in China with authoritative administrative boundaries, drill-down map interaction, explicit experience-level marking, bilingual UI, and local-first persistence.

## Features

- authoritative China map rendered from vendored GeoJSON data
- province drill-down into city-level administrative regions
- city-level visit tracking with province-wide bulk actions
- experience levels for visited places: long, medium, short
- live national and province-level statistics
- Simplified Chinese and English UI
- JSON import/export for visit records
- persisted state with `localStorage`

## Interaction Model

- Clicking a province on the national map enters that province without mutating visit data.
- Clicking a city selects it and opens an inline experience-level chooser.
- Selecting `long`, `medium`, or `short` marks or updates the city immediately.
- Clearing a city or province is an explicit action.
- Province coverage metrics are derived from city-level data: a province counts as visited once any city in it has a saved experience level.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Apache ECharts

## Run Locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

## Documentation

- Architecture: [docs/architecture.md](./docs/architecture.md)
- Current product spec: [docs/mvp-spec.md](./docs/mvp-spec.md)
- Deployment and usage guide: [DEPLOYMENT_AND_USAGE.md](./DEPLOYMENT_AND_USAGE.md)

## Notes

- GeoJSON assets are vendored locally under `public/geojson/china`.
- Locale preference and visit data are persisted in `localStorage`.
- The codebase is structured to support future backend sync, richer trip metadata, and AI-assisted features.
