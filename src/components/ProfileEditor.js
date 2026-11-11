import { html } from "../html.js";
import { Field, ImageField } from "./fields.js";
import { badUrl, badMail } from "../utils.js";

export const ProfileEditor = ({ p, set, say }) => {
  const up = (k) => (v) => set({ ...p, [k]: v });
  return html`<div>
    <h2>Profile</h2>
    <${Field}
      label="Full name"
      value=${p.name}
      onChange=${up("name")}
      err=${p.name.trim() ? "" : "Name is required"}
    />
    <${Field}
      label="Professional title"
      value=${p.title}
      onChange=${up("title")}
    />
    <${Field}
      label="Short biography"
      area
      value=${p.bio}
      onChange=${up("bio")}
      maxLength="400"
    />
    <${ImageField}
      label="Profile picture"
      value=${p.photo}
      onChange=${up("photo")}
      say=${say}
    />
    <div class="g2">
      <${Field}
        label="Email"
        type="email"
        value=${p.email}
        onChange=${up("email")}
        err=${badMail(p.email)}
      />
      <${Field}
        label="Location"
        value=${p.location}
        onChange=${up("location")}
      />
    </div>
    <${Field}
      label="GitHub profile"
      type="url"
      value=${p.github}
      onChange=${up("github")}
      err=${badUrl(p.github)}
      placeholder="https://github.com/username"
    />
    <${Field}
      label="LinkedIn profile"
      type="url"
      value=${p.linkedin}
      onChange=${up("linkedin")}
      err=${badUrl(p.linkedin)}
      placeholder="https://linkedin.com/in/username"
    />
    <${Field}
      label="Personal website"
      type="url"
      value=${p.website}
      onChange=${up("website")}
      err=${badUrl(p.website)}
      placeholder="https://example.com"
    />
  </div>`;
};
