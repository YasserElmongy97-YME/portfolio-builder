# Portfolio Builder

A responsive React application for creating and previewing a personal portfolio website, customizing its theme, saving edits in the browser, and exporting the finished portfolio as a standalone HTML file.

## Features

- Edit profile details, skills, projects, and links.
- Choose and customize theme presets, colors, fonts, buttons, and corner radius.
- Preview the generated portfolio live at desktop, tablet, and mobile widths.
- Save changes automatically in browser `localStorage`.
- Export a standalone HTML portfolio.
- Responsive generated portfolio output.

## Tech stack

React 18, Vite 5, and `htm`.

## Run locally

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`.

## Deployment

The included GitHub Actions workflow builds the app and deploys it to GitHub Pages whenever a commit is pushed to `main`.

## Demo data

The app starts with fictional sample profile data so the editor can be explored immediately. Replace it with your own details before recording or sharing a personal portfolio. The app stores edited content only in the current browser's local storage; the application does not upload that content to a backend.

## Internship task deliverables

- Public GitHub repository: `https://github.com/YasserElmongy97-YME/portfolio-builder`
- Live demo: `https://yasserelmongy97-yme.github.io/portfolio-builder/`
- Example generated portfolio: [`examples/portfolio-demo.html`](examples/portfolio-demo.html)
- Demo video and LinkedIn post: to be added after recording.
