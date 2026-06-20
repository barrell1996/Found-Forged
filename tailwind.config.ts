import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2523",
        paper: "#f8f5ef",
        moss: "#596b54",
        clay: "#a65f46",
        brass: "#c59b58",
      },
      boxShadow: {
        soft: "0 16px 40px rgba(31, 37, 35, 0.09)",
      },
    },
  },
  plugins: [],
};

export default config;
