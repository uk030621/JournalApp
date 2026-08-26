/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          bg: "#14171C",
          surface: "#1B1F26",
          surface2: "#20252D",
          border: "#2C313A",
          text: "#E8E3D8",
          muted: "#9A9488",
        },
        parchment: {
          bg: "#F3EEE2",
          surface: "#FBF8F1",
          surface2: "#F6F1E4",
          border: "#E1D8C3",
          text: "#2B2620",
          muted: "#7A7263",
        },
        brass: {
          DEFAULT: "#C9974F",
          light: "#E0B87A",
          dark: "#9C7538",
        },
        moss: {
          DEFAULT: "#7A8B6F",
          light: "#9CAD8F",
          dark: "#586552",
        },
        rust: {
          DEFAULT: "#B5573D",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      boxShadow: {
        soft: "0 8px 30px -12px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "ruled-lines":
          "repeating-linear-gradient(to bottom, transparent, transparent 35px, currentColor 36px)",
      },
    },
  },
  plugins: [],
};
