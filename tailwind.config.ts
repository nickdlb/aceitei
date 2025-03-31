import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        acbg: 'var(--acbg)',
        acbgbranco: 'var(--acbgbranco)',
        actextocinza: 'var(--actextocinza)',
        acpreto: 'var(--acpreto)',
        acazul: 'var(--acazul)',
        accinza: 'var(--accinza)',
        acbranco: 'var(--acbranco)',
        acbrancohover: 'var(--acbrancohover)',
        acvermelho: 'var(--acvermelho)',
        acverde: 'var(--acverde)',
        aclaranja: 'var(--aclaranja)',
        acroxo: 'var(--acroxo)',

      },
    },
  },
  plugins: [],
} satisfies Config;
