# GeoMemo

> An elegant travel map for recording where you've been across China.

GeoMemo is a polished, local-first web application for exploring China's administrative map, marking visited places with meaningful travel experience levels, and viewing your progress through a premium, map-first interface.

![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-149ECA?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![ECharts](https://img.shields.io/badge/Apache_ECharts-Map-DA2C43?style=flat-square)

## Live Demo

Try GeoMemo online:

**[Open the live demo](https://your-project-name.vercel.app)**

Replace the placeholder URL above with your deployed production URL.

## Preview

> Replace these placeholders with real screenshots when ready.

| Main map overview | Province drill-down |
| --- | --- |
| ![China map overview placeholder](https://placehold.co/1200x760/EFF4F8/223347?text=China+Map+Overview) | ![Province drill-down placeholder](https://placehold.co/1200x760/F4F7FA/223347?text=Province+Drill-Down) |

| Marking interaction | Statistics and side panel |
| --- | --- |
| ![Marking interaction placeholder](https://placehold.co/1200x760/F8F5EF/223347?text=Experience-Level+Marking) | ![Statistics panel placeholder](https://placehold.co/1200x760/F2F5F9/223347?text=Statistics+and+Records+Panel) |

## Features

- Interactive China map with province drill-down and second-level administrative unit exploration
- Experience-based travel records:
  - `Long-term stay`
  - `Short-term stay`
  - `Travel`
- Real-time completion statistics for province-level and lower-level coverage
- Bilingual UI with Simplified Chinese and English
- Local-first persistence with `localStorage`
- JSON import and export for record backup and migration
- Clean, Apple-inspired visual design with map-first interaction

## Built With

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Apache ECharts
- Vendored GeoJSON administrative boundary data

## Project Structure

GeoMemo is organized around a clean separation between data, state, rendering, and UI:

```text
src/
├── app/                    # app bootstrap and global styling
├── data/adminDivisions/    # canonical administrative hierarchy dataset
├── entities/               # domain models and reference data adapters
├── features/
│   ├── map/                # map rendering, drill-down, legend, interactions
│   ├── stats/              # derived statistics and metric presentation
│   └── visit/              # record panels, import/export, page hooks
├── pages/                  # page-level layout composition
└── shared/                 # store, i18n, shared UI primitives, utilities
```

Core modules:

- `map`: ECharts-based rendering, province drill-down, viewport behavior
- `state`: Zustand store, persistence, import/export normalization
- `data`: province and second-level administrative hierarchy
- `stats`: coverage, completion, and experience-level aggregation
- `ui`: panels, controls, layout, language switching

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Start development

```bash
npm run dev
```

Open the local Vite URL shown in the terminal, typically:

```text
http://localhost:5173
```

### Validate administrative data

```bash
npm run validate:admin
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Usage

### Explore the map

- Start on the national China overview
- Click a province to drill into its second-level administrative regions
- Use the breadcrumb to return to the national view

### Record your travel

- Click a lower-level region on the map or in the side panel
- Choose an experience level:
  - `Long-term stay`
  - `Short-term stay`
  - `Travel`
- Update or clear records at any time

### Track progress

- Watch province-level and lower-level completion update in real time
- Review experience distribution in the statistics section

### Change language

- Switch instantly between Simplified Chinese and English
- Your language preference is remembered locally

### Move your data

- Export records to JSON for backup
- Import compatible JSON files to restore or migrate your data

### Reset records

- Reset all records from the national view
- Reset only the active province when working inside a province

## Data & Design Notes

GeoMemo is built on a repository-owned administrative dataset that is designed to be explicit, auditable, and maintainable.

Current standard:

- 34 province-level administrative units
- 334 second-level administrative units
- The national/root China view is not counted as a province

The second-level layer includes:

- prefecture-level cities
- autonomous prefectures
- leagues
- prefectures / regions
- municipality-equivalent records for the four direct-controlled municipalities

Why this approach:

- It avoids the incomplete “293 prefecture-level cities only” model
- It reflects the broader real administrative hierarchy more accurately
- It keeps statistics, drill-down logic, side-panel records, and persistence aligned to one dataset

Dataset location:

- `src/data/adminDivisions/china-admin-divisions.json`

Validation:

- `npm run validate:admin`

The validator checks:

- province totals
- second-level totals
- duplicate ids and names
- parent/child mapping consistency
- exclusion of the root China node from province metrics

## Deployment

GeoMemo is a frontend-only Vite application and is a good fit for static hosting platforms such as:

- Vercel
- Netlify
- Cloudflare Pages

Recommended Vercel settings:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

## Documentation

- [Architecture](./docs/architecture.md)
- [Current Product Spec](./docs/mvp-spec.md)
- [Deployment and Usage Guide](./DEPLOYMENT_AND_USAGE.md)

## Future Improvements

- travel timeline and time-based progress views
- route and journey visualization
- AI-generated travel insights and summaries
- richer metadata such as notes, photos, and tags
- optional backend sync and multi-device support
- smarter map lazy-loading and bundle optimization

## Notes

- GeoJSON assets are vendored locally under `public/geojson/china`
- Visit data and locale preferences are stored in `localStorage`
- The project is structured to support long-term product evolution, not just a demo build
