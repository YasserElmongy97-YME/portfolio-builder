import React from "react";
import htm from "htm";

const PROPS = {
  class: "className",
  for: "htmlFor",
  srcdoc: "srcDoc",
  tabindex: "tabIndex",
  autofocus: "autoFocus",
  maxlength: "maxLength",
  spellcheck: "spellCheck",
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
};

const h = (type, props, ...children) =>
  React.createElement(
    type,
    props &&
      Object.fromEntries(
        Object.entries(props).map(([k, v]) => [PROPS[k] ?? k, v]),
      ),
    ...children,
  );

export const html = htm.bind(h);
