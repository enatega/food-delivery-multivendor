import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  // content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      transitionProperty: {
        // Customize or disable transition properties
        none: "none",
      },
      colors: {
        "primary-color": "var(--primary-color)",
        "primary-light": "var(--primary-light)",
        "primary-dark": "var(--primary-dark)",
        "primary-hover": "var(--primary-hover)",
        "primary-focus": "var(--primary-focus)",
        "secondary-color": "var(--secondary-color)",
        "secondary-border-color": "#111827",
        "dispatch-ground": "var(--dispatch-ground)",
        "dispatch-surface": "var(--dispatch-surface)",
        "dispatch-map": "var(--dispatch-map)",
        "dispatch-ink": "var(--dispatch-ink)",
        "dispatch-muted": "var(--dispatch-muted)",
        "dispatch-line": "var(--dispatch-line)",
      },
      maxWidth: {
        "dispatch-page": "1720px",
        "dispatch-copy": "72ch",
      },
      boxShadow: {
        "dispatch-float": "0 18px 42px rgba(21, 25, 20, 0.12)",
        "dispatch-overlay": "0 24px 64px rgba(21, 25, 20, 0.18)",
      },
      width: {
        "custom-button": "110px",
        "app-bar-search-width": "408px",
      },
      height: {
        "custom-button": "45px",
      },
      fontSize: {
        "heading-1": "20px",
        "heading-2": "36px",
        "card-h1": "16px",
        "card-h2": "",
        "btn-h": "",
      },
      fontFamily: {
        inter: ["var(--font-interface)", "ui-sans-serif", "system-ui"],
        dispatch: ["var(--font-interface)", "ui-sans-serif", "system-ui"],
      },
      scale: {
        102: "1.02",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
} satisfies Config;

export default config;
