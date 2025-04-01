/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#1C1C1C",
                "dark-gray": "#2A2A2A",
                secondary: "#004D4D",
                accent: "#FF3B3B",
                "highlight-teal": "#008C8C",
                "highlight-electric-blue": "#0051FF",
                text: "#ECF0F1",
                "secondary-text": "#A2ADB5",
            },
        },
    },
    plugins: [],
};
