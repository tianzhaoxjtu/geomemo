/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#112033",
        mist: "#eef3f8",
        line: "#d9e3ee",
        visited: "#2563eb",
        partial: "#f59e0b",
        idle: "#cbd5e1"
      },
      boxShadow: {
        panel: "0 18px 40px rgba(17, 32, 51, 0.10)"
      }
    }
  },
  plugins: []
};
