/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            backgroundColor: {
                softBlue: '#0EA5E9',
                softBlack: '#050E12',
                softGray: '#B6B6B6',
            },
        },
    },
    plugins: [require('tailwind-scrollbar')],
}
