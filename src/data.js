export const KEY = "portfolio-builder:v1";
export const PRESETS = {
  modern: {
    label: "Modern Light",
    primary: "#2563eb",
    secondary: "#0f2a5c",
    background: "#ffffff",
    font: "sans",
    button: "solid",
    radius: 12,
  },
  dark: {
    label: "Dark Developer",
    primary: "#38bdf8",
    secondary: "#a78bfa",
    background: "#0b1220",
    font: "mono",
    button: "outline",
    radius: 6,
  },
  minimal: {
    label: "Minimal Professional",
    primary: "#111827",
    secondary: "#6b7280",
    background: "#fafaf9",
    font: "serif",
    button: "solid",
    radius: 2,
  },
  gradient: {
    label: "Creative Gradient",
    primary: "#7c3aed",
    secondary: "#ec4899",
    background: "#fdf4ff",
    font: "sans",
    button: "pill",
    radius: 20,
  },
};
export const FONTS = {
  sans: [
    "Modern Sans",
    "Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif",
  ],
  serif: ["Classic Serif", "Georgia,Cambria,Times New Roman,serif"],
  mono: [
    "Developer Mono",
    "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
  ],
};
export const DEFAULT = {
  profile: {
    name: "Alex Morgan",
    title: "Full Stack Developer",
    bio: "I build fast, accessible web applications and enjoy turning complex problems into simple interfaces.",
    photo: "",
    email: "alex@example.com",
    location: "Cairo, Egypt",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    website: "",
  },
  skills: [
    { id: "s1", name: "JavaScript", category: "Frontend", level: 90 },
    { id: "s2", name: "React", category: "Frontend", level: 85 },
    { id: "s3", name: "Java", category: "Backend", level: 70 },
    { id: "s4", name: "SQL", category: "Backend", level: 75 },
  ],
  projects: [
    {
      id: "p1",
      title: "Task Planner",
      description: "A drag-and-drop planner with offline support.",
      thumb: "",
      tech: "React, CSS",
      repo: "https://github.com/",
      demo: "",
    },
  ],
  theme: { preset: "modern", ...PRESETS.modern },
};
export const load = () => {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.profile && s.theme) return { ...DEFAULT, ...s };
  } catch {}
  return DEFAULT;
};
