/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [
    "./src/**/*.{html,ts,tsx,js,jsx}",
    "./node_modules/@ionic/angular/dist/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Use the CSS variables defined in variables.css
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        success: "var(--success)",
        danger: "var(--danger)",
        warning: "var(--warning)",
        info: "var(--info)",
        light: "var(--light)",
        medium: "var(--medium)",
        dark: "var(--dark)",
        background: "var(--background)",
        text: "var(--text)",
      },
      boxShadow: {
        "t-md": "0px -4px 8px -6px rgba(0, 0, 0, 0.3)",
      },
      fontFamily: {
        sans: ["Helvetica", "Arial", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
