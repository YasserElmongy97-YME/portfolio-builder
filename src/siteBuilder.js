import { esc, link, img, lum } from "./utils.js";
import {
  FONT_FAMILIES,
  SHADOWS,
  fontsHref,
  resolveTheme,
  stackOf,
} from "./themeConfig.js";
import { metadataTag } from "./portfolioFile.js";

export function buildSite({ profile: p, skills, projects, theme: t }) {
  const c = resolveTheme(t),
    on = lum(t.primary) > 0.45 ? "#0b1220" : "#fff",
    grad = t.preset === "gradient";
  const hf = stackOf(c.headingFont, t.font),
    bf = stackOf(c.bodyFont, t.font);
  const fontIds = [c.headingFont, c.bodyFont].filter((id) => FONT_FAMILIES[id]);
  const fontLinks = fontIds.length
    ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="${esc(fontsHref(fontIds))}">`
    : "";
  const padding = {
    compact: ".5em 1.1em",
    regular: ".7em 1.4em",
    roomy: ".9em 1.8em",
  }[c.buttonPadding];
  const navBar =
    "background:color-mix(in srgb,var(--bg) 85%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--ln)";
  const extraCss = [
    {
      page: "",
      surface: "section{background:var(--sf)}",
      alternate: "section:nth-of-type(even){background:var(--sf)}",
    }[c.sectionBg],
    c.sectionDivider === "line"
      ? "section{border-top:1px solid var(--ln)}"
      : "",
    c.gridColumns
      ? `.pg{grid-template-columns:repeat(${c.gridColumns},1fr)}@media(max-width:700px){.pg{grid-template-columns:1fr}}`
      : "",
    c.navStyle === "centered" ? "nav .w{justify-content:center}" : "",
    {
      none: "",
      fade: ".btn:hover{opacity:.88}",
      lift: ".btn:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,0,0,.15)}",
    }[c.buttonHover],
    {
      none: "",
      color: "",
      underline: "nav a:hover,nav a.on{box-shadow:0 2px 0 var(--a)}",
      pill: "nav a{padding:4px 12px;border-radius:999px}nav a:hover,nav a.on{background:color-mix(in srgb,var(--a) 14%,transparent)}",
    }[c.navActive],
  ].join("\n");
  const navScript =
    c.navActive === "none"
      ? ""
      : `<script>(function(){if(!("IntersectionObserver" in window))return;var l=[].slice.call(document.querySelectorAll("nav a"));var o=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){l.forEach(function(a){a.classList.toggle("on",a.getAttribute("href")==="#"+x.target.id)})}})},{rootMargin:"-45% 0px -50% 0px"});document.querySelectorAll("header[id],section[id],footer[id]").forEach(function(s){o.observe(s)})})()</script>`;
  const groups = {};
  skills.forEach((s) => (groups[s.category || "General"] ??= []).push(s));
  const links = [
    ["GitHub", p.github],
    ["LinkedIn", p.linkedin],
    ["Website", p.website],
  ].filter((l) => link(l[1]));
  const initials = esc(
    p.name
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?",
  );
  const tag = (x) =>
    x
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => `<span class="tag">${esc(s)}</span>`)
      .join("");
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.name)} | ${esc(p.title)}</title>${fontLinks}<style>
:root{--p:${t.primary};--s:${t.secondary};--a:${c.accent};--bg:${t.background};--tx:${c.text};--mu:${c.textMuted};--sf:${c.surface};--ln:${c.border};--r:${t.radius}px;--cr:${c.cardRadius}px;--br:${c.buttonRadius}px;--on:${on};--maxw:${c.maxWidth}px;--pad:${c.containerPadding}px;--sec:${c.sectionSpacing}px;--gap:${c.cardGap}px;--cb:${c.cardBorder ? c.cardBorderWidth : 0}px;--cs:${SHADOWS[c.cardShadow]};--hf:${hf};--hw:${c.headingWeight};--hs:${c.headingSize / 100};--hl:${c.headingLineHeight};--hls:${c.headingSpacing}em;--ha:${c.headingAlign};--ng:${c.navSpacing}px;--sm:${c.smallSize}px}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--tx);font:${c.bodyWeight} ${c.bodySize}px/${c.bodyLineHeight} ${bf};letter-spacing:${c.bodySpacing}em}
a{color:var(--a)}.w{max-width:var(--maxw);margin:auto;padding:0 var(--pad)}
nav{position:sticky;top:0;z-index:5;${c.navStyle === "minimal" ? "background:transparent" : navBar}}
nav .w{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-top:12px;padding-bottom:12px;flex-wrap:wrap}nav b{color:var(--p);font-weight:500;font-family:var(--hf)}nav div{display:flex;gap:var(--ng);flex-wrap:wrap}nav a{text-decoration:none;color:var(--mu);font-weight:500;font-size:${c.navSize}px}nav a:hover,nav a.on{color:var(--a)}
.hero{padding:calc(var(--sec)*1.2) 0;${grad ? "background:linear-gradient(135deg,var(--p),var(--s));color:#fff" : ""}}.hero .w{display:flex;gap:36px;align-items:center;flex-wrap:wrap}.hero h1{font-family:var(--hf);font-size:calc(clamp(2rem,6vw,3.4rem)*var(--hs));line-height:var(--hl);margin:0 0 8px;font-weight:var(--hw);letter-spacing:var(--hls)}
.hero h2{font-family:var(--hf);margin:0 0 14px;font-weight:500;color:${grad ? "rgba(255,255,255,.9)" : "var(--p)"};font-size:1.25rem}.hero p{max-width:540px;color:${grad ? "rgba(255,255,255,.9)" : "var(--mu)"}}
.pic{width:170px;height:170px;border-radius:${t.radius >= 20 ? "50%" : "var(--r)"};object-fit:cover;display:grid;place-items:center;font-size:3rem;font-weight:500;background:var(--p);color:var(--on);border:4px solid var(--sf)}
.btn{display:inline-block;padding:${padding};border-radius:var(--br);font-weight:${c.buttonWeight};font-size:${c.buttonSize}px;text-decoration:none;border:2px solid ${grad ? "#fff" : "var(--p)"};margin:8px 8px 0 0;transition:opacity .15s ease,transform .15s ease,box-shadow .15s ease}
.btn.a{background:${t.button === "outline" ? "transparent" : grad ? "#fff" : "var(--p)"};color:${t.button === "outline" ? "var(--p)" : grad ? "var(--p)" : "var(--on)"}}.btn.b{background:transparent;color:${grad ? "#fff" : "var(--p)"}}
section{padding:var(--sec) 0}h3{font-family:var(--hf);font-size:calc(1.7rem*var(--hs));line-height:var(--hl);letter-spacing:var(--hls);text-align:var(--ha);margin:0 0 24px;color:var(--s);font-weight:var(--hw)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:var(--gap)}
.card{background:var(--sf);border:var(--cb) solid var(--ln);border-radius:var(--cr);box-shadow:var(--cs);overflow:hidden;transition:border-color .15s ease}.card:hover{border-color:var(--a)}.card .c{padding:18px}.card img{width:100%;height:150px;object-fit:cover;display:block}
.card h4{font-family:var(--hf);margin:0 0 4px;font-weight:var(--hw);letter-spacing:var(--hls)}.card p{margin:0 0 10px;color:var(--mu)}.tag{display:inline-block;font-size:var(--sm);padding:2px 10px;margin:0 6px 6px 0;border-radius:999px;background:color-mix(in srgb,var(--a) 14%,transparent);color:var(--a);font-weight:500}
.sk{margin-bottom:12px}.sk div{display:flex;justify-content:space-between;font-size:calc(var(--sm)*1.2)}.bar{height:8px;border-radius:99px;background:var(--ln);overflow:hidden}.bar i{display:block;height:100%;background:var(--a);border-radius:99px}
h5{margin:0 0 12px;color:var(--mu);font-size:calc(var(--sm)*1.17);font-weight:500}footer{padding:40px 0;text-align:center;color:var(--mu);border-top:1px solid var(--ln)}footer a{margin:0 8px}footer small{font-size:calc(var(--sm)*1.1)}
${extraCss}
</style>${metadataTag({ profile: p, skills, projects, theme: t })}</head><body>
<nav><div class="w"><b>${esc(p.name)}</b><div><a href="#about">About</a><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#contact">Contact</a></div></div></nav>
<header class="hero" id="about"><div class="w">${img(p.photo) ? `<img class="pic" src="${img(p.photo)}" alt="${esc(p.name)}">` : `<div class="pic" aria-hidden="true">${initials}</div>`}<div><h1>${esc(p.name)}</h1><h2>${esc(p.title)}</h2><p>${esc(p.bio)}</p><a class="btn a" href="#projects">View projects</a><a class="btn b" href="#contact">Contact me</a></div></div></header>
<section id="skills"><div class="w"><h3>Skills</h3>${
    skills.length
      ? `<div class="grid">${Object.entries(groups)
          .map(
            ([c, l]) =>
              `<div><h5>${esc(c)}</h5>${l.map((s) => `<div class="sk"><div><span>${esc(s.name)}</span><span>${s.level}%</span></div><div class="bar"><i style="width:${s.level}%"></i></div></div>`).join("")}</div>`,
          )
          .join("")}</div>`
      : `<p>No skills added yet.</p>`
  }</div></section>
<section id="projects"><div class="w"><h3>Projects</h3>${projects.length ? `<div class="grid pg">${projects.map((j) => `<article class="card">${img(j.thumb) ? `<img src="${img(j.thumb)}" alt="">` : ""}<div class="c"><h4>${esc(j.title)}</h4><p>${esc(j.description)}</p>${tag(j.tech)}<div>${link(j.repo) ? `<a href="${link(j.repo)}" target="_blank" rel="noopener">Source</a>` : ""}${link(j.repo) && link(j.demo) ? " · " : ""}${link(j.demo) ? `<a href="${link(j.demo)}" target="_blank" rel="noopener">Live demo</a>` : ""}</div></div></article>`).join("")}</div>` : `<p>No projects added yet.</p>`}</div></section>
<footer id="contact"><div class="w"><h3>Get in touch</h3>${p.email ? `<p><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></p>` : ""}${p.location ? `<p>${esc(p.location)}</p>` : ""}<p>${links.map((l) => `<a href="${link(l[1])}" target="_blank" rel="noopener">${l[0]}</a>`).join("")}</p><small>&copy; ${new Date().getFullYear()} ${esc(p.name)}</small></div></footer>${navScript}</body></html>`;
}
