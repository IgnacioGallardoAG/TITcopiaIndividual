// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'josefin': ['"Josefin Sans"', 'sans-serif'],
      },
      colors: {
        text: '#000000',
        highlight: '#d26745',
        border: '#d77949',
        background: '#de944e',
        contrast: '#ffffff',
        link: '#cf4360',
        hover: '#f2d35d',
        buttonHover: '#e09a50',
        buttonNormal: '#f2d65d',
        buttonText: '#4A4A4A',
        other1: '#4983A4',
        other2: '#75AA5C',
      },
      fontSize: {
        'h1': '40px',
        'h2': '30px',
        'normal': '18px',
        'small': '12px',
      },
      fontWeight: {
        normal: 400,
        bold: 700,
      },
      lineHeight: {
        'normal': '1.5',
      },
    },
  },
  plugins: [],
}
