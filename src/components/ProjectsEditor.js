import { useState } from "react";
import { html } from "../html.js";
import { Icon } from "./Icon.js";
import { Field, ImageField } from "./fields.js";
import { uid, badUrl } from "../utils.js";

export const BLANK = {
  title: "",
  description: "",
  thumb: "",
  tech: "",
  repo: "",
  demo: "",
};
export const ProjectsEditor = ({ projects, set, ask, say }) => {
  const [dr, setDr] = useState(null);
  const up = (k) => (v) => setDr({ ...dr, [k]: v });
  const errs = dr && {
    title: dr.title.trim() ? "" : "Title is required",
    repo: badUrl(dr.repo),
    demo: badUrl(dr.demo),
  };
  const save = (e) => {
    e.preventDefault();
    if (Object.values(errs).some(Boolean))
      return say("Fix the highlighted fields first");
    set(
      dr.id
        ? projects.map((p) => (p.id === dr.id ? dr : p))
        : [...projects, { ...dr, id: uid() }],
    );
    setDr(null);
  };
  if (dr)
    return html`<form onSubmit=${save}>
      <h2>${dr.id ? "Edit project" : "New project"}</h2>
      <${Field}
        label="Project title"
        value=${dr.title}
        onChange=${up("title")}
        err=${errs.title}
      />
      <${Field}
        label="Description"
        area
        value=${dr.description}
        onChange=${up("description")}
      />
      <${ImageField}
        label="Thumbnail"
        value=${dr.thumb}
        onChange=${up("thumb")}
        say=${say}
      />
      <${Field}
        label="Technologies (comma separated)"
        value=${dr.tech}
        onChange=${up("tech")}
        placeholder="React, Node.js"
      />
      <${Field}
        label="GitHub repository URL"
        type="url"
        value=${dr.repo}
        onChange=${up("repo")}
        err=${errs.repo}
      />
      <${Field}
        label="Live demo URL"
        type="url"
        value=${dr.demo}
        onChange=${up("demo")}
        err=${errs.demo}
      />
      <div class="row">
        <button class="btn" type="submit">Save project</button
        ><button type="button" class="btn ghost" onClick=${() => setDr(null)}>
          Cancel
        </button>
      </div>
    </form>`;
  return html`<div>
    <h2>Projects</h2>
    <button class="btn" onClick=${() => setDr(BLANK)}>
      <${Icon} n="plus" /> Add project
    </button>
    <div style=${{ height: 16 }}></div>
    ${!projects.length && html`<p class="empty">No projects yet. Add one to showcase your work.</p>`}
    ${projects.map(
      (p) =>
        html`<div class="card" key=${p.id}>
          <div class="row">
            <div class="row">
              ${p.thumb && html`<img class="th" src=${p.thumb} alt="" />`}<strong
                >${p.title}</strong
              >
            </div>
            <div class="row">
              <button
                class="btn ghost sm"
                aria-label=${"Edit " + p.title}
                onClick=${() => setDr(p)}
              >
                <${Icon} n="pencil" s=${16} />
              </button>
              <button
                class="btn ghost sm danger"
                aria-label=${"Delete " + p.title}
                onClick=${() => ask("Delete the project “" + p.title + "”?", () => set(projects.filter((x) => x.id !== p.id)))}
              >
                <${Icon} n="trash" s=${16} />
              </button>
            </div>
          </div>
          <p>${p.description}</p>
        </div>`,
    )}
  </div>`;
};
