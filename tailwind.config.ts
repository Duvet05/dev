import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000", // Negro
        secondary: "#ffffff", // Blanco
      },
      fontFamily: {
        'sans': ['var(--font-vt323)', 'VT323', 'monospace'], // Fuente principal
        'mono': ['var(--font-vt323)', 'VT323', 'monospace'], // Fuente monospace
        'bauhaus': ['Bauhaus 93', 'Impact', 'Arial Black', 'sans-serif'], // Bauhaus sistema (títulos)
        'bauhaus-pixel': ['var(--font-bauhaus-pixel)', 'Bauhaus 93', 'sans-serif'], // Tu Bauhaus Pixel local
        'bebas': ['var(--font-bebas)', 'Bebas Neue', 'sans-serif'],
        'vt323': ['var(--font-vt323)', 'VT323', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
