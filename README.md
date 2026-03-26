# GeoMemo

GeoMemo is a React + TypeScript + Vite application for tracking places visited in China with authoritative administrative boundaries, drill-down map interaction, explicit experience-level marking, bilingual UI, and local-first persistence.

## Administrative Standard

GeoMemo uses a repository-owned logical administrative dataset as its single source of truth for province and second-level administrative statistics:

- 34 province-level administrative units
- 334 second-level administrative units
- the national/root China node is not counted as a province

The dataset lives in:

- `src/data/adminDivisions/china-admin-divisions.json`

Validate it with:

```bash
npm run validate:admin
```

## Features

- authoritative China map rendered from vendored GeoJSON data
- province drill-down into second-level administrative units aligned to the canonical admin dataset
- prefecture-level unit visit tracking with province-wide bulk actions
- experience levels for visited places: long, medium, short
- live national and province-level statistics
- Simplified Chinese and English UI
- JSON import/export for visit records
- persisted state with `localStorage`

## Interaction Model

- Clicking a province on the national map enters that province without mutating visit data.
- Clicking a second-level unit selects it and opens an inline experience-level chooser.
- Selecting `long`, `medium`, or `short` marks or updates the selected unit immediately.
- Clearing a unit or province is an explicit action.
- Province coverage metrics are derived from second-level records: a province counts as visited once any mapped unit in it has a saved experience level.

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
npm run validate:admin
npm run build
npm run preview
```

## Deployment

### Recommended Platform

Vercel is the recommended hosting platform for this project because GeoMemo is a frontend-only Vite application with static assets and no backend runtime requirements.

Why Vercel fits well:

- native support for Vite projects
- simple GitHub-based deployment flow
- automatic production and preview deployments
- reliable static asset hosting for the vendored GeoJSON files under `public/`

### Live Demo URL

Add your production URL here after deployment, for example:

```text
https://your-project-name.vercel.app
```

### How to Deploy Your Own Version

1. Push the latest code to your GitHub repository.
2. Go to [Vercel](https://vercel.com/).
3. Sign in with GitHub.
4. Click `Add New...` → `Project`.
5. Import the GeoMemo repository.
6. Use these project settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. Click `Deploy`.
8. After deployment finishes, Vercel will provide a public URL such as:
   - `https://your-project-name.vercel.app`

### Environment Notes

- No environment variables are required for the current implementation.
- The app is fully local-first and stores user data in `localStorage`.
- The vendored GeoJSON files are served as static assets from `public/geojson/china`.

### Routing Notes

- The current app does not use path-based client-side routing, so no special SPA rewrite rule is required.
- Refreshing the deployed app at its root URL works normally.
- If route-based navigation is added later, configure your host with an SPA fallback to `index.html`.

## Documentation

- Architecture: [docs/architecture.md](./docs/architecture.md)
- Current product spec: [docs/mvp-spec.md](./docs/mvp-spec.md)
- Deployment and usage guide: [DEPLOYMENT_AND_USAGE.md](./DEPLOYMENT_AND_USAGE.md)

## Notes

- GeoJSON assets are vendored locally under `public/geojson/china`.
- Logical province/second-level metadata is vendored under `src/data/adminDivisions`.
- Locale preference and visit data are persisted in `localStorage`.
- The codebase is structured to support future backend sync, richer trip metadata, and AI-assisted features.
