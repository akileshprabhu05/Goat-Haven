/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /* ── Storefront palette: pitch, chalk and a referee's card ── */
        paper: "#EEF0EA",     // page background (cool, slightly green grey)
        chalk: "#FAFBF7",     // raised surfaces, pitch-line white
        turf: {
          DEFAULT: "#0B2D21", // deep pitch green: hero, footer, primary buttons
          deep: "#061A12",
          mid: "#14513A",
          soft: "#2A7A58",
        },
        ink: {
          DEFAULT: "#0C1D16", // body text on light
          soft: "#3D4D44",    // secondary text
          mute: "#5A695F",    // tertiary text (4.9:1 on paper)
        },
        line: "#CBD1C5",      // hairlines on light
        caution: "#FFD21F",   // yellow card: one highlight colour, used sparingly
        sendoff: "#D93A2F",   // red card: sold out / errors
        wa: "#25D366",        // WhatsApp, kept recognisable on purpose

        /* ── Admin console (dark): zinc is re-tinted to pitch-green ink ── */
        zinc: {
          50: "#F5F8F5",
          100: "#EBF1EC",
          200: "#D9E2DB",
          300: "#B9C8BE",
          400: "#93A89A",
          500: "#6B8274",
          600: "#435A4D",
          700: "#2B4136",
          800: "#1B2E25",
          900: "#0F1F18",
          950: "#08150F",
        },
        brand: {
          black: "#08150F",
          dark: "#0F1F18",
          card: "#0F1F18",
          border: "#1B2E25",
          muted: "#6B8274",
          gray: "#93A89A",
          light: "#EBF1EC",
          accent: "#157A4D",       // buttons/fills (white text = 5.4:1)
          accentHover: "#0F6540",
          glow: "#5EDC9B",         // accent as text/icon on dark surfaces
          gold: "#FFD21F",
          emerald: "#10b981",
        },
      },
      fontFamily: {
        sans: ['"Hanken Grotesk Variable"', "Hanken Grotesk", "system-ui", "sans-serif"],
        display: ['"Big Shoulders Display Variable"', '"Big Shoulders Display"', "Oswald", "Impact", "sans-serif"],
      },
      boxShadow: {
        lift: "0 1px 0 rgba(12,29,22,.04), 0 10px 30px -12px rgba(12,29,22,.25)",
      },
    },
  },
  plugins: [],
}
