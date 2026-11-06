# Billo

## Local development

Install dependencies and start the frontend:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Vite dev server
loads `VITE_API_URL` from `.env.local`; the default backend URL is
`http://localhost:4000`.

To run the desktop app with the frontend:

```bash
npm run electron:dev
```

## Build

```bash
npm run typecheck
npm run lint
npm run build
npm run electron:build
```

Vite writes the static frontend to `out/`, which Electron loads using its
`app://` protocol. Electron installer artifacts are written to `release/`.

## GitHub Actions desktop builds

Pushing to `main` runs the **Build desktop apps** workflow for macOS and
Windows. You can also start it manually from the repository's **Actions**
tab. When both jobs finish, download the `billo-macOS` and `billo-Windows`
artifacts from the workflow run.

## Imports and Sass

The `@/*` TypeScript path alias is configured in `tsconfig.json` and resolved
by Vite. Sass can load shared files from `src/styles` at any depth:

```scss
@use "variables" as *;
```
