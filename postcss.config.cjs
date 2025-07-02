const tailwind = require('@tailwindcss/postcss');

module.exports = {
  plugins: [
    tailwind(), // Agora usando o plugin correto
    require('autoprefixer')
  ]
};
