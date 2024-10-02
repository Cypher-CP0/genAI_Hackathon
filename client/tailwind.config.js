// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Update this according to your project structure
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A202C', // Dark Blue
        secondary: '#2D3748', // Lighter Dark Blue
        accent: '#3182CE', // Blue Accent
        background: '#EDF2F7', // Light Gray Background
        cardBg: '#FFFFFF', // White Card Background
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Make sure you have the 'Inter' font installed
      },
      boxShadow: {
        custom: '0px 4px 14px 0px rgba(0,0,0,0.1)', // Custom shadow for card elements
      },
    },
  },
  plugins: [],
};
