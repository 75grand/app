const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './App.tsx',
        './**/*.{ts,tsx}'
    ],
    theme: {
        extend: {
            borderColor: {
                DEFAULT: colors.zinc[200]
            }
        },
        colors: {
            accent: colors.sky[700],
            black: colors.black,
            white: colors.white,
            transparent: colors.transparent,

            // Close enough to Apple's official gray scale
            gray: colors.zinc,

            // Apple's official iOS system colors
            // https://developer.apple.com/design/human-interface-guidelines/color#iOS-iPadOS-system-colors
            red: '#ff3b30',
            orange: '#ff9500',
            yellow: '#ffcc00',
            green: '#34c759',
            mint: '#00c7be',
            teal: '#30b0c7',
            cyan: '#32ade6',
            blue: '#007aff',
            indigo: '#5856d6',
            purple: '#af52de',
            pink: '#ff2d55',
            brown: '#a2845e'
        }
    },
    plugins: []
}