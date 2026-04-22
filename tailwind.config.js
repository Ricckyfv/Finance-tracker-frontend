/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-secondary-fixed": "#00210c",
        "primary": "#00113a",
        "inverse-primary": "#b3c5ff",
        "on-primary": "#ffffff",
        "on-surface": "#191c1e",
        "surface-container-low": "#f3f4f6",
        "surface-tint": "#435b9f",
        "error": "#ba1a1a",
        "on-secondary-fixed-variant": "#005227",
        "inverse-surface": "#2e3132",
        "on-background": "#191c1e",
        "on-tertiary-fixed-variant": "#00522d",
        "inverse-on-surface": "#f0f1f3",
        "on-primary-container": "#758dd5",
        "secondary-fixed": "#83fba5",
        "on-error-container": "#93000a",
        "primary-container": "#002366",
        "surface-container-lowest": "#ffffff",
        "surface-variant": "#e1e2e4",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#003018",
        "outline": "#757682",
        "primary-fixed": "#dbe1ff",
        "on-secondary-container": "#00743a",
        "surface-bright": "#f8f9fb",
        "tertiary-fixed": "#9af6b8",
        "background": "#f8f9fb",
        "on-primary-fixed": "#00174a",
        "on-primary-fixed-variant": "#2a4386",
        "tertiary-fixed-dim": "#7ed99e",
        "surface-container-highest": "#e1e2e4",
        "surface": "#f8f9fb",
        "error-container": "#ffdad6",
        "secondary-fixed-dim": "#66dd8b",
        "surface-container": "#edeef0",
        "primary-fixed-dim": "#b3c5ff",
        "on-secondary": "#ffffff",
        "outline-variant": "#c5c6d2",
        "on-tertiary-fixed": "#00210f",
        "secondary-container": "#83fba5",
        "on-tertiary-container": "#46a16a",
        "on-error": "#ffffff",
        "secondary": "#006d36",
        "surface-dim": "#d9dadc",
        "surface-container-high": "#e7e8ea",
        "tertiary": "#00190a",
        "on-surface-variant": "#444650"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      fontFamily: {
        "headline": ["Manrope"],
        "body": ["Inter"],
        "label": ["Inter"]
      }
    },
  },
  plugins: [],
}

