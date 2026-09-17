/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "#F6F7FB",
        surface: "#FFFFFF",
        secondaryBg: "#F0F2F8",
        subtleBorder: "#E2E5ED",
        primary: {
          DEFAULT: "#5B5CE2",
          hover: "#4D4ED0",
          light: "#EEF0FF",
        },
        cyanAccent: {
          DEFAULT: "#18AFC4",
          light: "#EEF7FA",
        },
        purpleAccent: {
          DEFAULT: "#8B7CF6",
          light: "#F3F0FF",
        },
        textMain: "#202433",
        textSecondary: "#687085",
        textMuted: "#9299AA",
        success: {
          DEFAULT: "#16A982",
          light: "#E6F7F3",
        },
        warning: {
          DEFAULT: "#E59A18",
          light: "#FFF9EC",
          border: "#F1D99A",
        },
        error: {
          DEFAULT: "#D95C68",
          light: "#FDE8EA",
        }
      },
      boxShadow: {
        card: "0 4px 20px rgba(31, 35, 50, 0.06)",
        cardHover: "0 8px 30px rgba(31, 35, 50, 0.09)",
        drawer: "-4px 0 24px rgba(31, 35, 50, 0.08)",
      },
      borderRadius: {
        card: "16px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
