/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neur-dark': '#0f172a',
                'neur-panel': '#1e293b',
                'neur-accent': '#38bdf8',
                'neur-danger': '#ef4444'
            }
        },
    },
    plugins: [],
}
