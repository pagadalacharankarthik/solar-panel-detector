/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'antigravity-dark': '#0f172a',
                'antigravity-accent': '#38bdf8',
                'antigravity-card': '#1e293b',
            }
        },
    },
    plugins: [],
}
