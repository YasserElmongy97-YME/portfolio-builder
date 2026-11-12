import { Fragment, useState, useRef } from "react";
import { html } from "../html.js";
import { Icon } from "./Icon.js";
import {
  ImportError,
  MAX_FILE_BYTES,
  parsePortfolioHtml,
} from "../portfolioFile.js";
import { ALL_PRESETS } from "../themeConfig.js";

const readFile = (file, onProgress) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (e) =>
      e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    reader.onload = () => resolve(reader.result);
    reader.onerror = () =>
      reject(new ImportError("The file could not be read."));
    reader.readAsText(file);
  });

export const ImportDialog = ({ onClose, onApply }) => {
  const [stage, setStage] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [over, setOver] = useState(false);
  const input = useRef();

  const load = async (file) => {
    setError("");
    if (!file) return;
    if (!/\.html?$/i.test(file.name))
      return setError("Choose an .html file exported from Portfolio Builder.");
    if (file.size > MAX_FILE_BYTES)
      return setError("This file is larger than 10 MB and cannot be imported.");
    setStage("reading");
    setProgress(0);
    try {
      setResult(parsePortfolioHtml(await readFile(file, setProgress)));
      setStage("review");
    } catch (e) {
      setError(
        e instanceof ImportError
          ? e.message
          : "This file could not be processed.",
      );
      setStage("idle");
    }
  };
  const drop = (e) => {
    e.preventDefault();
    setOver(false);
    load(e.dataTransfer.files[0]);
  };
  const pick = (e) => {
    load(e.target.files[0]);
    e.target.value = "";
  };
  const open = () => input.current.click();
  const d = result?.data;

  return html`<div
    class="mask"
    onClick=${() => stage !== "reading" && onClose()}
  >
    <div
      class="dlg wide"
      role="dialog"
      aria-modal="true"
      aria-label="Import portfolio"
      onClick=${(e) => e.stopPropagation()}
    >
      <div class="row">
        <strong>Import portfolio</strong>
        <button class="btn ghost sm" aria-label="Close" onClick=${onClose}>
          <${Icon} n="x" />
        </button>
      </div>
      ${
        stage === "idle" &&
        html`<${Fragment}
          ><p>
            Select an HTML file you previously exported from Portfolio Builder.
            Your current portfolio stays unchanged until you confirm.
          </p>
          <div
            class=${"drop" + (over ? " over" : "")}
            role="button"
            tabindex="0"
            onClick=${open}
            onKeyDown=${(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open())}
            onDragOver=${(e) => (e.preventDefault(), setOver(true))}
            onDragLeave=${() => setOver(false)}
            onDrop=${drop}
          >
            <${Icon} n="upload" s=${24} />
            <span>Drop an exported .html file here, or choose one</span>
          </div>
          <input
            ref=${input}
            type="file"
            accept=".html,.htm,text/html"
            hidden
            onChange=${pick}
            aria-label="Portfolio file"
          />
          ${error && html`<p class="err" role="alert">${error}</p>`}<//
        >`
      }
      ${
        stage === "reading" &&
        html`<${Fragment}
          ><p>Reading file…</p>
          <progress max="100" value=${progress}></progress
        ><//>`
      }
      ${
        stage === "review" &&
        html`<${Fragment}
          ><p>
            ${result.legacy ? "Recovered from an older export:" : "Ready to import:"}
          </p>
          <ul class="sum">
            <li>
              <strong>${d.profile.name}</strong
              >${d.profile.title && " · " + d.profile.title}
            </li>
            <li>${d.skills.length} skills · ${d.projects.length} projects</li>
            <li>Theme: ${ALL_PRESETS[d.theme.preset]?.label ?? "Custom"}</li>
          </ul>
          ${result.warnings.map((w) => html`<p class="warn" key=${w}>${w}</p>`)}
          <p>
            This replaces the portfolio you are currently editing. Export it
            first if you want to keep a copy.
          </p>
          <div class="row end">
            <button class="btn ghost" onClick=${() => setStage("idle")}>
              Choose another file
            </button>
            <button class="btn" onClick=${() => onApply(d)}>
              ${result.legacy ? "Import recovered content" : "Replace current portfolio"}
            </button>
          </div><//
        >`
      }
    </div>
  </div>`;
};
