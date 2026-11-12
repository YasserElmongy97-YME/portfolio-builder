export const uid = () => Math.random().toString(36).slice(2, 9);
export const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const link = (u) => (/^https?:\/\//i.test(u || "") ? esc(u) : "");
export const img = (u) =>
  /^(https?:|data:image\/)/i.test(u || "") ? esc(u) : "";
export const slug = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "portfolio";
export const badUrl = (v) =>
  v && !/^https?:\/\/\S+\.\S+/.test(v)
    ? "Enter a full URL starting with https://"
    : "";
export const badMail = (v) =>
  v && !/^\S+@\S+\.\S+$/.test(v) ? "Enter a valid email address" : "";
export const lum = (h) => {
  const n = parseInt(h.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

// Scales an image down and re-encodes it so large photos fit in localStorage.
export const compressImage = (file, max = 900, quality = 0.82) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, max / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas
        .getContext("2d")
        .drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      let out = canvas.toDataURL("image/webp", quality);
      if (!out.startsWith("data:image/webp"))
        out = canvas.toDataURL("image/jpeg", quality);
      resolve(out);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unreadable image"));
    };
    image.src = url;
  });

export const downloadFile = (filename, text) => {
  const url = URL.createObjectURL(new Blob([text], { type: "text/html" }));
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  });
  link.click();
  URL.revokeObjectURL(url);
};

export const mix = (a, b, weight) => {
  const channels = (hex) =>
    [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [x, y] = [channels(a), channels(b)];
  return (
    "#" +
    x
      .map((v, i) =>
        Math.round(v * (1 - weight) + y[i] * weight)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
};
