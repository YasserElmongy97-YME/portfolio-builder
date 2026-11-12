import { useState, useEffect, useMemo, useRef } from "react";
import { html } from "./html.js";
import { DEFAULT, KEY, load } from "./data.js";
import { slug, downloadFile } from "./utils.js";
import { buildSite } from "./siteBuilder.js";
import { Icon } from "./components/Icon.js";
import { ProfileEditor } from "./components/ProfileEditor.js";
import { SkillsEditor } from "./components/SkillsEditor.js";
import { ProjectsEditor } from "./components/ProjectsEditor.js";
import { ThemeEditor } from "./components/ThemeEditor.js";
import { ImportDialog } from "./components/ImportDialog.js";

const TABS = [
  ["profile", "Profile", "user"],
  ["skills", "Skills", "code"],
  ["projects", "Projects", "folder"],
  ["theme", "Theme", "palette"],
];
const DEVICES = [
  ["desktop", "Desktop", "100%"],
  ["tablet", "Tablet", "768px"],
  ["mobile", "Mobile", "375px"],
];

const App = () => {
  const [d, setD] = useState(load),
    [tab, setTab] = useState("profile"),
    [dev, setDev] = useState("desktop"),
    [full, setFull] = useState(false);
  const [status, setStatus] = useState("saved"),
    [toast, setToast] = useState(""),
    [dlg, setDlg] = useState(null),
    [importing, setImporting] = useState(false);
  const first = useRef(true);
  const set = (k) => (v) => setD((o) => ({ ...o, [k]: v }));
  const say = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 2800);
  };
  const ask = (msg, yes) => setDlg({ msg, yes });
  const site = useMemo(() => buildSite(d), [d]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setStatus("saving");
    const t = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(d));
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    }, 350);
    return () => clearTimeout(t);
  }, [d]);

  const exportSite = async () => {
    try {
      await downloadFile(slug(d.profile.name) + "-portfolio.html", site);
      say("Portfolio exported");
    } catch (e) {
      if (e?.code !== "declined") say("Export failed. Please try again.");
    }
  };
  const applyImport = (data) => {
    setD(data);
    setTab("profile");
    setImporting(false);
    say("Portfolio imported");
  };
  const reset = () =>
    ask(
      "Reset everything to the default portfolio? Your changes will be lost.",
      () => {
        try {
          localStorage.removeItem(KEY);
        } catch {}
        setD(DEFAULT);
        say("Portfolio reset");
      },
    );
  const width = DEVICES.find((x) => x[0] === dev)[2];
  const frame = html`<iframe
    title="Portfolio preview"
    srcdoc=${site}
    sandbox="allow-scripts"
    style=${{ maxWidth: full ? "100%" : width }}
  />`;

  return html`<div>
    <header>
      <div class="logo">
        <i><${Icon} n="layout" /></i>Portfolio Builder
      </div>
      <nav aria-label="Sections">
        ${TABS.map(([k, l]) => html`<button key=${k} onClick=${() => setTab(k)}>${l}</button>`)}
      </nav>
      <div class="sp"></div>
      <div class="status" role="status">
        <span class=${"dot " + status}></span
        ><em
          >${status === "saved" ? "All changes saved" : status === "saving" ? "Saving…" : "Could not save"}</em
        >
      </div>
      <button class="btn ghost" onClick=${() => setImporting(true)}>
        <${Icon} n="upload" /><span>Import</span>
      </button>
      <button class="btn ghost" onClick=${reset} aria-label="Reset">
        <${Icon} n="reset" /><span>Reset</span>
      </button>
      <button class="btn ghost" onClick=${() => setFull(true)}>
        <${Icon} n="eye" /><span>Preview</span>
      </button>
      <button class="btn" onClick=${exportSite}>
        <${Icon} n="download" /><span>Export</span>
      </button>
    </header>
    <main>
      <section class="panel editor" aria-label="Editor">
        <div class="tabs" role="tablist">
          ${TABS.map(([k, l, i]) => html`<button key=${k} role="tab" aria-selected=${tab === k} onClick=${() => setTab(k)}><${Icon} n=${i} s=${16} />${l}</button>`)}
        </div>
        <div class="body" role="tabpanel">
          ${tab === "profile" && html`<${ProfileEditor} p=${d.profile} set=${set("profile")} say=${say} />`}
          ${tab === "skills" && html`<${SkillsEditor} skills=${d.skills} set=${set("skills")} ask=${ask} />`}
          ${tab === "projects" && html`<${ProjectsEditor} projects=${d.projects} set=${set("projects")} ask=${ask} say=${say} />`}
          ${tab === "theme" && html`<${ThemeEditor} t=${d.theme} set=${set("theme")} ask=${ask} />`}
        </div>
      </section>
      <section class="panel pv" aria-label="Live preview">
        <div class="bar">
          <strong>Live preview</strong>
          <div class="sp"></div>
          ${DEVICES.map(([k, l]) => html`<button key=${k} class="btn ghost sm" aria-pressed=${dev === k} aria-label=${l + " preview"} title=${l} onClick=${() => setDev(k)}><${Icon} n=${k} s=${16} /></button>`)}
        </div>
        <div class="stage">${frame}</div>
      </section>
    </main>
    ${
      full &&
      html`<div class="full" role="dialog" aria-label="Full preview">
        <div class="bar">
          <strong>Preview</strong>
          <div class="sp"></div>
          ${DEVICES.map(([k, l]) => html`<button key=${k} class="btn ghost sm" aria-pressed=${dev === k} aria-label=${l} onClick=${() => setDev(k)}><${Icon} n=${k} s=${16} /></button>`)}
          <button class="btn sm" onClick=${() => setFull(false)}>
            <${Icon} n="x" s=${16} /> Close
          </button>
        </div>
        <div class="stage" style=${{ borderRadius: 0 }}>${frame}</div>
      </div>`
    }
    ${
      dlg &&
      html`<div class="mask" onClick=${() => setDlg(null)}>
        <div
          class="dlg"
          role="alertdialog"
          aria-modal="true"
          onClick=${(e) => e.stopPropagation()}
        >
          <strong>Confirm</strong>
          <p>${dlg.msg}</p>
          <div class="row">
            <button class="btn ghost" autofocus onClick=${() => setDlg(null)}>
              Cancel
            </button>
            <button
              class="btn"
              onClick=${() => {
                dlg.yes();
                setDlg(null);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>`
    }
    ${importing && html`<${ImportDialog} onClose=${() => setImporting(false)} onApply=${applyImport} />`}
    ${toast && html`<div class="toast" role="status">${toast}</div>`}
  </div>`;
};

export default App;
