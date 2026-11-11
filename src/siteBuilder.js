import { FONTS } from "./data.js";
import { esc, link, img, lum } from "./utils.js";

export function buildSite({ profile: p, skills, projects, theme: t }) {
  const dark = lum(t.background) < 0.4,
    on = lum(t.primary) > 0.45 ? "#0b1220" : "#fff",
    grad = t.preset === "gradient";
  const tx = dark ? "#e5e7eb" : "#0f172a",
    mu = dark ? "#94a3b8" : "#475569",
    sf = dark ? "rgba(255,255,255,.06)" : "#fff",
    ln = dark ? "rgba(255,255,255,.14)" : "rgba(15,23,42,.1)";
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
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.name)} | ${esc(p.title)}</title><style>
:root{--p:${t.primary};--s:${t.secondary};--bg:${t.background};--tx:${tx};--mu:${mu};--sf:${sf};--ln:${ln};--r:${t.radius}px;--br:${t.button === "pill" ? "999px" : t.radius + "px"};--on:${on}}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--tx);font:16px/1.65 ${FONTS[t.font][1]}}
a{color:var(--p)}.w{max-width:1000px;margin:auto;padding:0 20px}
nav{position:sticky;top:0;z-index:5;background:${dark ? "rgba(11,18,32,.85)" : "rgba(255,255,255,.85)"};backdrop-filter:blur(8px);border-bottom:1px solid var(--ln)}
nav .w{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-top:12px;padding-bottom:12px;flex-wrap:wrap}nav b{color:var(--p);font-weight:500}nav div{display:flex;gap:16px;flex-wrap:wrap}nav a{text-decoration:none;color:var(--mu);font-weight:500}nav a:hover{color:var(--p)}
.hero{padding:72px 0;${grad ? "background:linear-gradient(135deg,var(--p),var(--s));color:#fff" : ""}}.hero .w{display:flex;gap:36px;align-items:center;flex-wrap:wrap}.hero h1{font-size:clamp(2rem,6vw,3.4rem);line-height:1.1;margin:0 0 8px;font-weight:500;letter-spacing:-.02em}
.hero h2{margin:0 0 14px;font-weight:500;color:${grad ? "rgba(255,255,255,.9)" : "var(--p)"};font-size:1.25rem}.hero p{max-width:540px;color:${grad ? "rgba(255,255,255,.9)" : "var(--mu)"}}
.pic{width:170px;height:170px;border-radius:${t.radius >= 20 ? "50%" : "var(--r)"};object-fit:cover;display:grid;place-items:center;font-size:3rem;font-weight:500;background:var(--p);color:var(--on);border:4px solid var(--sf)}
.btn{display:inline-block;padding:.7em 1.4em;border-radius:var(--br);font-weight:500;text-decoration:none;border:2px solid ${grad ? "#fff" : "var(--p)"};margin:8px 8px 0 0;transition:opacity .15s ease}
.btn.a{background:${t.button === "outline" ? "transparent" : grad ? "#fff" : "var(--p)"};color:${t.button === "outline" ? "var(--p)" : grad ? "var(--p)" : "var(--on)"}}.btn.b{background:transparent;color:${grad ? "#fff" : "var(--p)"}}.btn:hover{opacity:.88}
section{padding:60px 0}h3{font-size:1.7rem;margin:0 0 24px;color:var(--s);font-weight:500}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px}
.card{background:var(--sf);border:1px solid var(--ln);border-radius:var(--r);overflow:hidden;transition:border-color .15s ease}.card:hover{border-color:var(--p)}.card .c{padding:18px}.card img{width:100%;height:150px;object-fit:cover;display:block}
.card h4{margin:0 0 4px;font-weight:500}.card p{margin:0 0 10px;color:var(--mu)}.tag{display:inline-block;font-size:.75rem;padding:2px 10px;margin:0 6px 6px 0;border-radius:999px;background:color-mix(in srgb,var(--p) 14%,transparent);color:var(--p);font-weight:500}
.sk{margin-bottom:12px}.sk div{display:flex;justify-content:space-between;font-size:.9rem}.bar{height:8px;border-radius:99px;background:var(--ln);overflow:hidden}.bar i{display:block;height:100%;background:var(--p);border-radius:99px}
h5{margin:0 0 12px;color:var(--mu);font-size:.875rem;font-weight:500}footer{padding:40px 0;text-align:center;color:var(--mu);border-top:1px solid var(--ln)}footer a{margin:0 8px}
</style></head><body>
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
<section id="projects"><div class="w"><h3>Projects</h3>${projects.length ? `<div class="grid">${projects.map((j) => `<article class="card">${img(j.thumb) ? `<img src="${img(j.thumb)}" alt="">` : ""}<div class="c"><h4>${esc(j.title)}</h4><p>${esc(j.description)}</p>${tag(j.tech)}<div>${link(j.repo) ? `<a href="${link(j.repo)}" target="_blank" rel="noopener">Source</a>` : ""}${link(j.repo) && link(j.demo) ? " · " : ""}${link(j.demo) ? `<a href="${link(j.demo)}" target="_blank" rel="noopener">Live demo</a>` : ""}</div></div></article>`).join("")}</div>` : `<p>No projects added yet.</p>`}</div></section>
<footer id="contact"><div class="w"><h3>Get in touch</h3>${p.email ? `<p><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></p>` : ""}${p.location ? `<p>${esc(p.location)}</p>` : ""}<p>${links.map((l) => `<a href="${link(l[1])}" target="_blank" rel="noopener">${l[0]}</a>`).join("")}</p><small>&copy; ${new Date().getFullYear()} ${esc(p.name)}</small></div></footer></body></html>`;
}
