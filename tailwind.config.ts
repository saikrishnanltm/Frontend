import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0E14",
        surface: "#12161F",
        surface2: "#181D28",
        line: "#242B38",
        fg: "#E8EAED",
        muted: "#8B95A7",
        add: "#3FB950",
        addDim: "#1F3D28",
        remove: "#F85149",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};

export default config;
