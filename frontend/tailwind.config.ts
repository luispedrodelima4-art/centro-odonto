import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          50: '#FDFBF7',
          100: '#F6EFE6',
          200: '#EBDCCB',
          300: '#DCBF9E',
          400: '#C49A6C',
          500: '#A67C52',
          600: '#8B623B',
          700: '#6F4B2B',
          800: '#52361D',
          900: '#362312',
          950: '#22160A',
        },
        clinical: {
          bg: '#FBFBFA',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          border: '#EAE6DF',
          muted: '#F4EFEA',
        }
      },
    },
  },
  plugins: [],
};
export default config;
