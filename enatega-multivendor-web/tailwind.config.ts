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
         "primary-color": "#75d04b",
        "primary-light": "#F3FFEE",
        "primary-dark": "#5AC12F",
        "secondary-color": "#0EA5E9",
        "secondary-border-color": "#111827"
          
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
        inter: ["Inter", "sans-serif"],
      },
      scale: {
        102: '1.02',
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
} satisfies Config;

export default config;
