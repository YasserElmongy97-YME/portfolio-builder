import React, { useState } from "react";
import { html } from "../html.js";
import {
  ALL_PRESETS,
  CONTROL_GROUPS,
  FONT_FAMILIES,
  FONT_GROUPS,
  resolveTheme,
} from "../themeConfig.js";

const HEX = /^#[0-9a-f]{6}$/i;

const HexInput = ({ value, onCommit }) => {
  const [text, setText] = useState(value);
  const [seen, setSeen] = useState(value);
  if (value !== seen) {
    setSeen(value);
    setText(value);
  }
  return html`<input
    type="text"
    value=${text}
    maxlength="7"
    spellcheck="false"
    aria-label="Hex color value"
    aria-invalid=${!HEX.test(text)}
    onChange=${(e) => {
      setText(e.target.value);
      if (HEX.test(e.target.value)) onCommit(e.target.value.toLowerCase());
    }}
    onBlur=${() => setText(value)}
  />`;
};

const Control = ({ c, value, up }) => {
  const id = "tc-" + c.k;
  const field = (input) =>
    React.createElement("div", { className: "f" }, ...[].concat(input));
  if (c.type === "color")
    return field(
      html`<label for=${id}>${c.label}</label>
        <div class="color">
          <input
            id=${id}
            type="color"
            value=${value}
            onChange=${(e) => up(c.k, e.target.value)}
          />
          <${HexInput} value=${value} onCommit=${(v) => up(c.k, v)} />
        </div>`,
    );
  if (c.type === "range")
    return field(
      html`<label for=${id}
          >${c.label} <code>${Math.min(value, c.max)}${c.unit}</code></label
        >
        <input
          id=${id}
          type="range"
          min=${c.min}
          max=${c.max}
          step=${c.step}
          value=${Math.min(value, c.max)}
          onChange=${(e) => up(c.k, +e.target.value)}
        />`,
    );
  if (c.type === "toggle")
    return field(
      html`<label class="chk"
        ><input
          type="checkbox"
          checked=${value}
          onChange=${(e) => up(c.k, e.target.checked)}
        />${c.label}</label
      >`,
    );
  if (c.type === "font")
    return field(
      html`<label for=${id}>${c.label}</label>
        <select
          id=${id}
          value=${value}
          onChange=${(e) => up(c.k, e.target.value)}
        >
          <option value="">Match theme font</option>
          ${FONT_GROUPS.map(
            (g) =>
              html`<optgroup key=${g} label=${g}>
                ${Object.entries(FONT_FAMILIES)
                  .filter(([, f]) => f.group === g)
                  .map(
                    ([k, f]) =>
                      html`<option key=${k} value=${k}>${f.label}</option>`,
                  )}
              </optgroup>`,
          )}
        </select>`,
    );
  return field(
    html`<label for=${id}>${c.label}</label>
      <select
        id=${id}
        value=${String(value)}
        onChange=${(e) => up(c.k, c.options.find((o) => String(o[0]) === e.target.value)[0])}
      >
        ${c.options.map((o) => html`<option key=${o[0]} value=${String(o[0])}>${o[1]}</option>`)}
      </select>`,
  );
};

const Group = ({ title, open, children }) =>
  html`<details class="acc" open=${open}>
    <summary>${title}</summary>
    <div class="in">${children}</div>
  </details>`;

export const ThemeEditor = ({ t, set, ask }) => {
  const up = (k, v) => set({ ...t, [k]: v });
  const resolved = resolveTheme(t);
  const resetSettings = () =>
    ask(
      "Reset all theme settings to the selected preset? Your profile, skills and projects are not affected.",
      () =>
        set(
          ALL_PRESETS[t.preset]
            ? { preset: t.preset, ...ALL_PRESETS[t.preset] }
            : { preset: "modern", ...ALL_PRESETS.modern },
        ),
    );
  return html`<div>
    <h2>Theme</h2>
    <${Group} title="Presets" open=${true}>
      <div class="presets">
        ${Object.entries(ALL_PRESETS).map(
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
      <button class="btn ghost sm" onClick=${resetSettings}>
        Reset theme settings
      </button>
    <//>
    ${CONTROL_GROUPS.map(
      (g) =>
        html`<${Group} key=${g.id} title=${g.title}>
          ${g.controls.map((c) => (c.h ? html`<div class="cat" key=${c.h}>${c.h}</div>` : html`<${Control} key=${c.k} c=${c} value=${resolved[c.k]} up=${up} />`))}
        <//>`,
    )}
  </div>`;
};
