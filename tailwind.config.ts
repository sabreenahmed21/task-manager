import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'custom-color': '#3B6790',
        'task-color': '#DDA15E',
        'important-color': '#BC6C25',
      },
      container: {
        center: true, 
      },
    },
  },
  plugins: [],
} satisfies Config;
