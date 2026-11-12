<div align="center">

<img src="public/logo-symbol.svg" alt="Billo logo" width="96" />

# Billo

**Invoices made simple.** Create and track monthly invoices in seconds.<br/>
Runs in the browser and as a desktop app for macOS and Windows.

[![Live demo](https://img.shields.io/badge/Live_demo-billo--three.vercel.app-6E56CF?style=for-the-badge)](https://billo-three.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Billo--Backend-24292F?style=for-the-badge&logo=github)](https://github.com/TamarCoder/Billo--Backend)

![React](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-47848F?logo=electron&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?logo=sass&logoColor=white)
[![Desktop build](https://github.com/TamarCoder/Billo/actions/workflows/desktop-build.yml/badge.svg)](https://github.com/TamarCoder/Billo/actions/workflows/desktop-build.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

<!-- TODO: add 2–3 screenshots or a GIF here, e.g. ![Billo](docs/screenshot.png) -->

---

## 💡 The problem

I built Billo because writing monthly invoices by hand took a lot of time.
The same data had to be typed again every time, and the risk of mistakes
was high.

## ✅ The solution

Billo keeps issuers, client companies and invoice templates in one place.
A new invoice takes a few seconds, and the history is grouped by month.

| | |
|---|---|
| 🗂️ **One place** | Issuers, client companies and invoice templates |
| ⚡ **Seconds, not minutes** | New invoice from a template, history by month |
| 💻 **Everywhere** | Browser, macOS and Windows |
| 🔐 **Accounts** | Register, log in, reset password |

## 🧱 Tech stack

| Layer | Tools |
|---|---|
| UI | React 19, TypeScript, Sass |
| Build | Vite |
| Desktop | Electron (`app://` protocol) |
| CI | GitHub Actions: macOS and Windows builds on every push to `main` |
| API | [Billo--Backend](https://github.com/TamarCoder/Billo--Backend): NestJS, PostgreSQL |

## 🚀 Quick start

```bash
git clone https://github.com/TamarCoder/Billo.git
cd Billo
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app reads `VITE_API_URL`
from `.env.local` (default backend: `http://localhost:4000`).

Desktop app in dev mode:

```bash
npm run electron:dev
```

<details>
<summary><b>🛠️ Build and environment details</b></summary>

<br/>

```bash
npm run typecheck
npm run lint
npm run build
npm run electron:build
```

| File | Used by |
|---|---|
| `.env.local` | Local development |
| `.env.production` | `npm run build` (web) |
| `.env.electron` | Electron build |

Vite writes the static frontend to `out/`. Electron loads it with the `app://`
protocol. Installers are written to `release/`.

</details>

<details>
<summary><b>📦 Desktop builds with GitHub Actions</b></summary>

<br/>

Every push to `main` runs the **Build desktop apps** workflow for macOS and
Windows. You can also start it from the **Actions** tab. When both jobs finish,
download the `billo-macOS` and `billo-Windows` artifacts from the run.

</details>

<details>
<summary><b>🎨 Imports and Sass</b></summary>

<br/>

The `@/*` path alias is set in `tsconfig.json` and resolved by Vite.
Sass loads shared files from `src/styles` at any depth:

```scss
@use "variables" as *;
```

</details>

## 📄 License

[MIT](LICENSE) © Tamar Khuskivadze
