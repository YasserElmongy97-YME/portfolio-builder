import React, { useRef } from "react";
import { html } from "../html.js";
import { compressImage } from "../utils.js";

export const Field = ({ label, err, area, onChange, ...rest }) => {
  const id = React.useId(),
    El = area ? "textarea" : "input";
  return html`<div class="f">
    <label for=${id}>${label}</label
    ><${El}
      id=${id}
      onChange=${(e) => onChange(e.target.value)}
      aria-invalid=${!!err}
      ...${rest}
    />${err && html`<small class="err" role="alert">${err}</small>`}
  </div>`;
};

export const ImageField = ({ label, value, onChange, say }) => {
  const ref = useRef();
  const pick = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 15_000_000)
      return say("Choose an image smaller than 15 MB");
    try {
      onChange(await compressImage(file));
    } catch {
      say("Could not read that image");
    }
  };
  return html`<div class="f">
    <span class="lab">${label}</span>
    <div class="row">
      ${value && html`<img class="th" src=${value} alt="Preview" />`}
      <button
        type="button"
        class="btn ghost sm"
        onClick=${() => ref.current.click()}
      >
        Upload image
      </button>
      <input
        ref=${ref}
        type="file"
        accept="image/*"
        hidden
        onChange=${pick}
        aria-label=${label}
      />
      ${value && html`<button type="button" class="btn ghost sm" onClick=${() => onChange("")}>Remove</button>`}
    </div>
  </div>`;
};
