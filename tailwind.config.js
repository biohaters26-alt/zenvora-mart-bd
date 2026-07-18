/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./context/**/*.{js,jsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#05070a",
          900: "#0a0f16",
          850: "#0d131b",
          800: "#111927",
          700: "#182338",
          600: "#22304a"
        },
        navy: {
          950: "#050a14",
          900: "#0a1220",
          800: "#0f1c31"
        },
        cyan: {
          glow: "#22e8f5",
          DEFAULT: "#20c9d8",
          soft: "#67f2ff"
        },
        emerald: {
          glow: "#1de9a3",
          DEFAULT: "#15c98a",
          soft: "#5bffcf"
        },
        gold: {
          DEFAULT: "#d4b46a"
        }
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(34,232,245,0.16), transparent 60%)",
        "crystal-gradient":
          "linear-gradient(135deg, rgba(34,232,245,0.10) 0%, rgba(29,233,163,0.06) 50%, rgba(255,255,255,0.02) 100%)",
        "hero-gradient":
          "linear-gradient(180deg, #050a14 0%, #0a1220 45%, #0d131b 100%)"
      },
      boxShadow: {
        glow: "0 0 24px rgba(34,232,245,0.25), 0 0 60px rgba(29,233,163,0.08)",
        "glow-lg":
          "0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(34,232,245,0.08), 0 0 40px rgba(34,232,245,0.10)",
        crystal:
          "inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 30px rgba(0,0,0,0.45)"
      },
      backdropBlur: {
        xs: "2px"
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.4s ease-in-out infinite",
        marquee: "marquee 22s linear infinite"
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulseGlow: {
          "0%,100%": { opacity: 1, boxShadow: "0 0 20px rgba(34,232,245,0.35)" },
          "50%": { opacity: 0.85, boxShadow: "0 0 40px rgba(29,233,163,0.45)" }
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }
        }
      }
    }
  },
  plugins: []
};
