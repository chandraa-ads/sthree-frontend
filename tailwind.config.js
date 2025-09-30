/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: '#E5E7EB',
        coral: '#FF6B6B',
        turquoise: '#4ECDC4',
        'soft-bg': '#F7F9FC',
        'text-primary': '#2C3E50',
      },
      backgroundImage: {
        'shop-gradient': 'linear-gradient(135deg, #FDE2FF 0%, #FAD9FF 50%, #F9E2FF 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
