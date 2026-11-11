import { html } from "../html.js";
import { PRESETS, FONTS } from "../data.js";

export const ThemeEditor = ({ t, set }) => {
  const up = (k, v) => set({ ...t, [k]: v });
  const Color = ({ k, label }) =>
    html`<div class="f">
      <label for=${"c" + k}>${label}</label>
      <div class="color">
        <input
          id=${"c" + k}
          type="color"
          value=${t[k]}
          onChange=${(e) => up(k, e.target.value)}
        /><code>${t[k]}</code>
      </div>
    </div>`;
  return html`<div>
    <h2>Theme</h2>
    <div class="presets">
      ${Object.entries(PRESETS).map(
        ([k, p]) =>
          html`<button
            key=${k}
            class="pz"
            aria-pressed=${t.preset === k}
            onClick=${() => set({ preset: k, ...p })}
          >
            <div class="sw">
              <span style=${{ background: p.background }}></span
              ><span style=${{ background: p.primary }}></span
              ><span style=${{ background: p.secondary }}></span>
            </div>
            <b>${p.label}</b>
          </button>`,
      )}
    </div>
    ${Color({ k: "primary", label: "Primary color" })}${Color({ k: "secondary", label: "Secondary color" })}${Color({ k: "background", label: "Background color" })}
    <div class="f">
      <label for="font">Typography</label
      ><select
        id="font"
        value=${t.font}
        onChange=${(e) => up("font", e.target.value)}
      >
        ${Object.entries(FONTS).map(([k, v]) => html`<option key=${k} value=${k}>${v[0]}</option>`)}
      </select>
    </div>
    <div class="f">
      <label for="btn">Button style</label
      ><select
        id="btn"
        value=${t.button}
        onChange=${(e) => up("button", e.target.value)}
      >
        <option value="solid">Solid</option>
        <option value="outline">Outline</option>
        <option value="pill">Pill</option>
      </select>
    </div>
    <div class="f">
      <label for="rad">Border radius <code>${t.radius}px</code></label
      ><input
        id="rad"
        type="range"
        min="0"
        max="32"
        value=${t.radius}
        onChange=${(e) => up("radius", +e.target.value)}
      />
    </div>
  </div>`;
};
