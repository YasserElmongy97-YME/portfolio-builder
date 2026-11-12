import { FONTS } from "./data.js";
import { sanitizeTheme } from "./themeConfig.js";
import { uid } from "./utils.js";

export const SCHEMA_VERSION = 1;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
const APP_ID = "portfolio-builder";
const META_ID = "portfolio-builder-data";
// Each recognized schema version maps to a function that upgrades its data to the current shape.
const MIGRATIONS = { 1: (data) => data };

export class ImportError extends Error {}

export const metadataTag = (data) => {
  const payload = JSON.stringify({
    app: APP_ID,
    schema: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  }).replace(/</g, "\\u003c");
  return `<script type="application/json" id="${META_ID}">${payload}</script>`;
};

const text = (value, max) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
const url = (value) =>
  /^https?:\/\/\S+$/i.test(text(value, 2048)) ? text(value, 2048) : "";
const image = (value) => {
  const v = typeof value === "string" ? value.trim() : "";
  return /^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+/=]+$/i.test(v) &&
    v.length < 2_000_000
    ? v
    : url(v);
};

export const sanitizePortfolio = (raw) => {
  if (
    !raw ||
    typeof raw !== "object" ||
    !raw.profile ||
    typeof raw.profile !== "object"
  ) {
    throw new ImportError(
      "The portfolio data is incomplete and cannot be imported.",
    );
  }
  const warnings = [];
  const p = raw.profile;
  const profile = {
    name: text(p.name, 120) || "Untitled",
    title: text(p.title, 160),
    bio: text(p.bio, 2000),
    photo: image(p.photo),
    email: text(p.email, 254),
    location: text(p.location, 160),
    github: url(p.github),
    linkedin: url(p.linkedin),
    website: url(p.website),
  };
  const skills = (Array.isArray(raw.skills) ? raw.skills : [])
    .slice(0, 200)
    .flatMap((s) =>
      s && text(s.name, 80)
        ? [
            {
              id: uid(),
              name: text(s.name, 80),
              category: text(s.category, 60) || "General",
              level: Math.min(100, Math.max(5, Math.round(+s.level) || 50)),
            },
          ]
        : [],
    );
  const projects = (Array.isArray(raw.projects) ? raw.projects : [])
    .slice(0, 100)
    .flatMap((j) =>
      j && text(j.title, 160)
        ? [
            {
              id: uid(),
              title: text(j.title, 160),
              description: text(j.description, 1000),
              thumb: image(j.thumb),
              tech: text(j.tech, 300),
              repo: url(j.repo),
              demo: url(j.demo),
            },
          ]
        : [],
    );
  const dropped =
    (raw.skills?.length ?? 0) -
    skills.length +
    ((raw.projects?.length ?? 0) - projects.length);
  if (dropped > 0)
    warnings.push(
      `${dropped} incomplete item${dropped === 1 ? " was" : "s were"} skipped.`,
    );
  return {
    data: { profile, skills, projects, theme: sanitizeTheme(raw.theme) },
    warnings,
  };
};

const recoverLegacy = (doc) => {
  const q = (sel) => doc.querySelector(sel);
  const content = (sel, root = doc) =>
    root.querySelector(sel)?.textContent.trim() ?? "";
  if (!q("nav") || !q("header.hero h1") || !q("#skills") || !q("#projects")) {
    throw new ImportError(
      "This file was not exported by Portfolio Builder, so it cannot be imported.",
    );
  }
  const footerLink = (label) =>
    [...doc.querySelectorAll("footer a")]
      .find((a) => a.textContent === label)
      ?.getAttribute("href") ?? "";
  const css = q("style")?.textContent ?? "";
  const cssVar = (name) =>
    css.match(new RegExp(`--${name}:(#[0-9a-fA-F]{6})`))?.[1];
  const radius = css.match(/--r:(\d+)px/)?.[1];
  const font = css.includes("Georgia")
    ? "serif"
    : css.includes("ui-monospace")
      ? "mono"
      : "sans";
  const button = css.includes("--br:999px")
    ? "pill"
    : css.includes(".btn.a{background:transparent")
      ? "outline"
      : "solid";
  const raw = {
    profile: {
      name: content("header.hero h1"),
      title: content("header.hero h2"),
      bio: content("header.hero p"),
      photo: q("img.pic")?.getAttribute("src") ?? "",
      email: (q('footer a[href^="mailto:"]')?.getAttribute("href") ?? "").slice(
        7,
      ),
      location:
        [...doc.querySelectorAll("footer p")].find((p) => !p.querySelector("a"))
          ?.textContent ?? "",
      github: footerLink("GitHub"),
      linkedin: footerLink("LinkedIn"),
      website: footerLink("Website"),
    },
    skills: [...doc.querySelectorAll("#skills .grid > div")].flatMap((group) =>
      [...group.querySelectorAll(".sk")].map((row) => ({
        name: content("span", row),
        category: content("h5", group),
        level: parseInt(row.querySelectorAll("span")[1]?.textContent, 10),
      })),
    ),
    projects: [...doc.querySelectorAll("#projects article.card")].map(
      (card) => ({
        title: content("h4", card),
        description: content("p", card),
        thumb: card.querySelector("img")?.getAttribute("src") ?? "",
        tech: [...card.querySelectorAll(".tag")]
          .map((t) => t.textContent)
          .join(", "),
        repo:
          [...card.querySelectorAll("a")]
            .find((a) => a.textContent === "Source")
            ?.getAttribute("href") ?? "",
        demo:
          [...card.querySelectorAll("a")]
            .find((a) => a.textContent === "Live demo")
            ?.getAttribute("href") ?? "",
      }),
    ),
    theme: {
      preset: css.includes("linear-gradient(135deg") ? "gradient" : "custom",
      primary: cssVar("p"),
      secondary: cssVar("s"),
      background: cssVar("bg"),
      radius: radius ? +radius : undefined,
      font: FONTS[font] ? font : "sans",
      button,
    },
  };
  const { data, warnings } = sanitizePortfolio(raw);
  return {
    data,
    legacy: true,
    warnings: [
      "This file was exported before import support was added. Only its visible content and basic theme colors could be recovered, so typography and other design details may differ.",
      ...warnings,
    ],
  };
};

export const parsePortfolioHtml = (source) => {
  const doc = new DOMParser().parseFromString(source, "text/html");
  const tag = doc.getElementById(META_ID);
  if (!tag) return recoverLegacy(doc);
  let payload;
  try {
    payload = JSON.parse(tag.textContent);
  } catch {
    throw new ImportError(
      "The embedded portfolio data is corrupted and cannot be read.",
    );
  }
  if (payload?.app !== APP_ID)
    throw new ImportError("This file was not exported by Portfolio Builder.");
  const migrate = MIGRATIONS[payload.schema];
  if (!migrate) {
    throw new ImportError(
      `This file uses an unsupported data version (${payload.schema}). Update Portfolio Builder and try again.`,
    );
  }
  const { data, warnings } = sanitizePortfolio(migrate(payload.data));
  return { data, legacy: false, warnings };
};
