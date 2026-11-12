import { PRESETS, FONTS } from "./data.js";
import { lum, mix } from "./utils.js";

const SANS = "system-ui,-apple-system,'Segoe UI',sans-serif";
const SERIF = "Georgia,Cambria,serif";
const family = (label, group, fallback, weights = "400;500;600;700") => ({
  label,
  group,
  weights,
  stack: `'${label}',${fallback}`,
});

export const FONT_GROUPS = ["Sans Serif", "Serif", "Display / Modern"];
export const FONT_FAMILIES = {
  inter: family("Inter", "Sans Serif", SANS),
  roboto: family("Roboto", "Sans Serif", SANS, "400;500;700"),
  "open-sans": family("Open Sans", "Sans Serif", SANS),
  lato: family("Lato", "Sans Serif", SANS, "400;700"),
  nunito: family("Nunito", "Sans Serif", SANS),
  "source-sans": family("Source Sans 3", "Sans Serif", SANS),
  "dm-sans": family("DM Sans", "Sans Serif", SANS),
  merriweather: family("Merriweather", "Serif", SERIF, "400;700"),
  playfair: family("Playfair Display", "Serif", SERIF),
  poppins: family("Poppins", "Display / Modern", SANS),
  montserrat: family("Montserrat", "Display / Modern", SANS),
  "space-grotesk": family("Space Grotesk", "Display / Modern", SANS),
};

export const SHADOWS = {
  none: "none",
  soft: "0 2px 8px rgba(0,0,0,.08)",
  medium: "0 6px 20px rgba(0,0,0,.14)",
  strong: "0 12px 36px rgba(0,0,0,.22)",
};

export const EXTRA_PRESETS = {
  editorial: {
    label: "Editorial Serif",
    primary: "#9a3412",
    secondary: "#1c1917",
    background: "#fffbf5",
    font: "serif",
    button: "solid",
    radius: 4,
    headingFont: "playfair",
    bodyFont: "merriweather",
    headingWeight: 600,
    headingSpacing: -0.01,
    bodySize: 17,
    maxWidth: 880,
    navStyle: "minimal",
    sectionDivider: "line",
  },
  studio: {
    label: "Studio Bold",
    primary: "#ea580c",
    secondary: "#111827",
    background: "#ffffff",
    font: "sans",
    button: "solid",
    radius: 16,
    headingFont: "poppins",
    bodyFont: "dm-sans",
    headingWeight: 700,
    headingSpacing: -0.03,
    maxWidth: 1100,
    cardShadow: "medium",
    cardBorder: false,
    buttonHover: "lift",
    sectionBg: "alternate",
    navActive: "pill",
  },
  nordic: {
    label: "Nordic Calm",
    primary: "#0f766e",
    secondary: "#134e4a",
    background: "#f0fdfa",
    font: "sans",
    button: "pill",
    radius: 12,
    headingFont: "space-grotesk",
    bodyFont: "inter",
    headingWeight: 600,
    headingAlign: "center",
    sectionSpacing: 72,
    gridColumns: 2,
    cardShadow: "soft",
    navStyle: "centered",
    navActive: "underline",
  },
};
export const ALL_PRESETS = { ...PRESETS, ...EXTRA_PRESETS };

const select = (k, label, options) => ({ k, label, type: "select", options });
const range = (k, label, min, max, step, unit) => ({
  k,
  label,
  type: "range",
  min,
  max,
  step,
  unit,
});
const color = (k, label) => ({ k, label, type: "color" });
const WEIGHTS = [
  [400, "Regular"],
  [500, "Medium"],
  [600, "Semibold"],
  [700, "Bold"],
];

export const CONTROL_GROUPS = [
  {
    id: "typography",
    title: "Typography",
    controls: [
      select(
        "font",
        "Theme font",
        Object.entries(FONTS).map(([k, v]) => [k, v[0]]),
      ),
      { h: "Headings" },
      { k: "headingFont", label: "Heading font", type: "font" },
      select("headingWeight", "Heading weight", WEIGHTS),
      range("headingSize", "Heading size", 80, 140, 5, "%"),
      range("headingSpacing", "Heading letter spacing", -0.05, 0.1, 0.01, "em"),
      range("headingLineHeight", "Heading line height", 1, 1.6, 0.05, ""),
      { h: "Body" },
      { k: "bodyFont", label: "Body font", type: "font" },
      select("bodyWeight", "Body weight", [
        [300, "Light"],
        ...WEIGHTS.slice(0, 3),
      ]),
      range("bodySize", "Body size", 14, 20, 1, "px"),
      range("bodyLineHeight", "Body line height", 1.3, 2, 0.05, ""),
      range("bodySpacing", "Body letter spacing", -0.02, 0.08, 0.01, "em"),
      { h: "Other text" },
      range("navSize", "Navigation size", 12, 20, 1, "px"),
      range("buttonSize", "Button size", 12, 20, 1, "px"),
      range("smallSize", "Small text size", 10, 16, 1, "px"),
    ],
  },
  {
    id: "colors",
    title: "Colors",
    controls: [
      color("primary", "Primary color"),
      color("secondary", "Secondary color"),
      color("accent", "Accent color"),
      color("background", "Page background"),
      color("surface", "Surface / card background"),
      color("text", "Main text"),
      color("textMuted", "Secondary text"),
      color("border", "Border color"),
    ],
  },
  {
    id: "layout",
    title: "Layout",
    controls: [
      range("maxWidth", "Content maximum width", 720, 1400, 20, "px"),
      range("sectionSpacing", "Section spacing", 24, 120, 4, "px"),
      range("containerPadding", "Container padding", 12, 48, 4, "px"),
      select("gridColumns", "Project grid columns", [
        [0, "Automatic"],
        [1, "1"],
        [2, "2"],
        [3, "3"],
        [4, "4"],
      ]),
      range("cardGap", "Card spacing", 8, 40, 4, "px"),
      select("headingAlign", "Section alignment", [
        ["left", "Left"],
        ["center", "Center"],
      ]),
    ],
  },
  {
    id: "components",
    title: "Cards & Components",
    controls: [
      { h: "Cards" },
      range("radius", "Base border radius", 0, 32, 1, "px"),
      range("cardRadius", "Card radius", 0, 32, 1, "px"),
      select("cardShadow", "Card shadow", [
        ["none", "None"],
        ["soft", "Soft"],
        ["medium", "Medium"],
        ["strong", "Strong"],
      ]),
      { k: "cardBorder", label: "Show card border", type: "toggle" },
      range("cardBorderWidth", "Card border thickness", 1, 4, 1, "px"),
      { h: "Buttons" },
      select("button", "Button style", [
        ["solid", "Solid"],
        ["outline", "Outline"],
        ["pill", "Pill"],
      ]),
      range("buttonRadius", "Button radius", 0, 32, 1, "px"),
      select("buttonHover", "Hover effect", [
        ["none", "None"],
        ["fade", "Fade"],
        ["lift", "Lift"],
      ]),
      select("buttonPadding", "Padding", [
        ["compact", "Compact"],
        ["regular", "Regular"],
        ["roomy", "Roomy"],
      ]),
      select("buttonWeight", "Font weight", WEIGHTS),
      { h: "Sections" },
      select("sectionBg", "Section background", [
        ["page", "Page"],
        ["surface", "Surface"],
        ["alternate", "Alternating"],
      ]),
      select("sectionDivider", "Separation", [
        ["none", "None"],
        ["line", "Divider line"],
      ]),
    ],
  },
  {
    id: "navigation",
    title: "Navigation",
    controls: [
      select("navStyle", "Navigation style", [
        ["bar", "Bar"],
        ["minimal", "Minimal"],
        ["centered", "Centered"],
      ]),
      range("navSpacing", "Link spacing", 8, 40, 4, "px"),
      select("navActive", "Active link", [
        ["none", "Hover only"],
        ["underline", "Underline"],
        ["pill", "Pill"],
        ["color", "Accent color"],
      ]),
    ],
  },
];
const CONTROLS = CONTROL_GROUPS.flatMap((g) => g.controls).filter((c) => c.k);

export const resolveTheme = (t) => {
  const dark = lum(t.background) < 0.4;
  return {
    headingFont: "",
    bodyFont: "",
    headingWeight: 500,
    headingSize: 100,
    headingSpacing: -0.02,
    headingLineHeight: 1.1,
    bodyWeight: 400,
    bodySize: 16,
    bodyLineHeight: 1.65,
    bodySpacing: 0,
    navSize: 16,
    buttonSize: 16,
    smallSize: 12,
    accent: t.primary,
    surface: dark ? mix(t.background, "#ffffff", 0.06) : "#ffffff",
    text: dark ? "#e5e7eb" : "#0f172a",
    textMuted: dark ? "#94a3b8" : "#475569",
    border: dark
      ? mix(t.background, "#ffffff", 0.14)
      : mix("#ffffff", "#0f172a", 0.1),
    maxWidth: 1000,
    sectionSpacing: 60,
    containerPadding: 20,
    gridColumns: 0,
    cardGap: 20,
    headingAlign: "left",
    cardRadius: t.radius,
    cardShadow: "none",
    cardBorder: true,
    cardBorderWidth: 1,
    buttonRadius: t.button === "pill" ? 999 : t.radius,
    buttonHover: "fade",
    buttonPadding: "regular",
    buttonWeight: 500,
    sectionBg: "page",
    sectionDivider: "none",
    navStyle: "bar",
    navSpacing: 16,
    navActive: "none",
    ...t,
  };
};

export const stackOf = (id, legacyFont) =>
  FONT_FAMILIES[id]?.stack ?? (FONTS[legacyFont] ?? FONTS.sans)[1];

export const fontsHref = (ids) =>
  "https://fonts.googleapis.com/css2?" +
  [...new Set(ids)]
    .map(
      (id) =>
        `family=${FONT_FAMILIES[id].label.replace(/ /g, "+")}:wght@${FONT_FAMILIES[id].weights}`,
    )
    .join("&") +
  "&display=swap";

const HEX = /^#[0-9a-f]{6}$/i;
const clean = {
  color: (c, v) =>
    typeof v === "string" && HEX.test(v) ? v.toLowerCase() : undefined,
  range: (c, v) =>
    Number.isFinite(+v) && v !== "" && v !== null
      ? Math.min(c.max, Math.max(c.min, +v))
      : undefined,
  toggle: (c, v) => (typeof v === "boolean" ? v : undefined),
  font: (c, v) => (v === "" || FONT_FAMILIES[v] ? v : undefined),
  select: (c, v) => c.options.find((o) => String(o[0]) === String(v))?.[0],
};

export const sanitizeTheme = (raw) => {
  const base = { ...PRESETS.modern };
  delete base.label;
  const source = raw && typeof raw === "object" ? raw : {};
  const known = typeof source.preset === "string" && ALL_PRESETS[source.preset];
  const theme = { ...base, preset: known ? source.preset : "custom" };
  if (known) theme.label = ALL_PRESETS[source.preset].label;
  CONTROLS.forEach((c) => {
    const value = clean[c.type](c, source[c.k]);
    if (value !== undefined) theme[c.k] = value;
  });
  return theme;
};
