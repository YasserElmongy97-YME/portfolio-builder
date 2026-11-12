# Portfolio Builder

Create, customize, preview and export a personal portfolio website.

## Run

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal (usually http://localhost:5173).

## Structure

- `src/App.jsx` – workspace layout, persistence, export
- `src/data.js` – default content, theme presets, storage load
- `src/siteBuilder.js` – generates the portfolio HTML used by the preview and the export
- `src/components/` – editors, form fields and icons
- `src/themeConfig.js` – font catalog, theme presets, design controls, theme defaults and validation
- `src/portfolioFile.js` – embedded metadata, schema versioning and import parsing
- `src/styles.css` – dashboard styling

Portfolio data is stored in `localStorage`. Export downloads a standalone HTML file.

## Export and import

**Export** downloads a standalone HTML portfolio. The file also carries a hidden, versioned JSON block (`<script type="application/json" id="portfolio-builder-data">`) holding the editable data: profile, skills, projects and every theme setting.

**Import** (header button) reads an exported file locally, validates it, shows a summary and replaces the current portfolio only after confirmation. Nothing from the file is executed, and a failed import leaves the current portfolio untouched. Files exported before import support existed contain no metadata; they can be imported with a warning, recovering only their visible content and basic theme colors.

The metadata format is versioned (`SCHEMA_VERSION` in `src/portfolioFile.js`). Add a migration to `MIGRATIONS` when the format changes.

## Theme customization

The Theme tab has presets plus grouped controls for typography, colors, layout, cards, buttons, sections and navigation. Theme values are stored as overrides on top of the selected preset, so older saved portfolios keep their appearance. Fonts are loaded from Google Fonts only when a catalog font is selected, with system-font fallbacks. "Reset theme settings" restores the selected preset without touching content.
