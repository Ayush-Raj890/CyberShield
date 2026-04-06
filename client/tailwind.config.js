export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8"
        },
        secondary: {
          100: "#e0f2fe",
          500: "#06b6d4",
          600: "#0891b2"
        },
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          500: "#64748b",
          700: "#334155",
          900: "#0f172a"
        }
      },
      boxShadow: {
        soft: "0 10px 24px rgba(15, 23, 42, 0.08)"
      },
      borderRadius: {
        xl: "0.75rem"
      }
    }
  },
  plugins: []
};
