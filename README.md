# GeoMemo

GeoMemo is a React + TypeScript + Vite application for tracking places visited in China with authoritative administrative boundaries, drill-down map interaction, experience levels, bilingual UI, and local-first persistence.

## Features

- authoritative China map rendered from vendored GeoJSON data
- province drill-down into city-level administrative regions
- city-level visit tracking with province-wide bulk actions
- experience levels for visited places: long, medium, short
- live national and province-level statistics
- Simplified Chinese and English UI
- JSON import/export for visit records
- persisted state with `localStorage`

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
