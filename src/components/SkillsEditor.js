import { useState } from "react";
import { html } from "../html.js";
import { Icon } from "./Icon.js";
import { Field } from "./fields.js";
import { uid } from "../utils.js";

export const SkillsEditor = ({ skills, set, ask }) => {
  const [n, setN] = useState({ name: "", category: "", level: 70 }),
    [err, setErr] = useState("");
  const cats = [...new Set(skills.map((s) => s.category).filter(Boolean))];
  const add = (e) => {
    e.preventDefault();
    if (!n.name.trim()) return setErr("Enter a skill name");
    set([
      ...skills,
      {
        id: uid(),
        name: n.name.trim(),
        category: n.category.trim() || "General",
        level: +n.level,
      },
    ]);
    setN({ ...n, name: "" });
    setErr("");
  };
  const upd = (id, k, v) =>
    set(skills.map((s) => (s.id === id ? { ...s, [k]: v } : s)));
  const groups = {};
  skills.forEach((s) => (groups[s.category || "General"] ??= []).push(s));
  return html`<div>
    <h2>Skills</h2>
    <form class="card" onSubmit=${add}>
      <${Field}
        label="Skill name"
        value=${n.name}
        onChange=${(v) => setN({ ...n, name: v })}
        err=${err}
      />
      <${Field}
        label="Category"
        list="cats"
        value=${n.category}
        onChange=${(v) => setN({ ...n, category: v })}
        placeholder="e.g. Frontend"
      />
      <datalist id="cats">
        ${cats.map((c) => html`<option key=${c} value=${c} />`)}
      </datalist>
      <div class="f">
        <label for="lv">Level <code>${n.level}%</code></label
        ><input
          id="lv"
          type="range"
          min="5"
          max="100"
          step="5"
          value=${n.level}
          onChange=${(e) => setN({ ...n, level: e.target.value })}
        />
      </div>
      <button class="btn" type="submit"><${Icon} n="plus" /> Add skill</button>
    </form>
    ${!skills.length && html`<p class="empty">No skills yet. Add your first one above.</p>`}
    ${Object.entries(groups).map(
      ([c, l]) =>
        html`<div key=${c}>
          <div class="cat">${c}</div>
          ${l.map(
            (s) =>
              html`<div class="skill" key=${s.id}>
                <input
                  type="text"
                  aria-label="Skill name"
                  value=${s.name}
                  onChange=${(e) => upd(s.id, "name", e.target.value)}
                />
                <input
                  type="text"
                  aria-label="Category"
                  value=${s.category}
                  onChange=${(e) => upd(s.id, "category", e.target.value)}
                />
                <button
                  class="btn ghost sm danger"
                  aria-label=${"Remove " + s.name}
                  onClick=${() => ask("Remove the skill “" + s.name + "”?", () => set(skills.filter((x) => x.id !== s.id)))}
                >
                  <${Icon} n="trash" s=${16} />
                </button>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  aria-label=${s.name + " level"}
                  value=${s.level}
                  onChange=${(e) => upd(s.id, "level", +e.target.value)}
                />
              </div>`,
          )}
        </div>`,
    )}
  </div>`;
};
