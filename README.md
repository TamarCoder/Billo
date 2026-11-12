# Billo

Billo is an app for creating and tracking invoices. It runs in the browser
and as a desktop app for macOS and Windows.

The API is here: [TamarCoder/Billo--Backend](https://github.com/TamarCoder/Billo--Backend).

<!-- TODO: add 2–3 screenshots or a GIF here, and a live demo link. -->

## The problem

I built Billo because writing monthly invoices by hand took a lot of time.
The same data had to be typed again every time, and the risk of mistakes
was high.

Billo keeps issuers, client companies and invoice templates in one place.
A new invoice takes a few seconds, and the history is grouped by month.
The app runs in the browser and as a desktop app for macOS and Windows.

## Features

- Register, log in, reset password
- Manage issuers and client companies
- Invoice templates (forms)
- Create invoices and see the invoice history
- Desktop app built with Electron, with automatic builds in GitHub Actions

## Tech stack

- **React 19** + **TypeScript**, built with **Vite**
- **Sass** for styles
- **Electron** for the desktop app
- **GitHub Actions** for macOS and Windows builds

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

Production builds use `.env.production` to connect to the deployed backend;
local development continues to use `.env.local`. Vite writes the static
frontend to `out/`, which Electron loads using its `app://` protocol. Electron
installer artifacts are written to `release/`.
The Electron build uses `.env.electron` to connect to the deployed backend;
local development continues to use `.env.local`.

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

## License

[MIT](LICENSE)
