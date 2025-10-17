module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // if using pages directory
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // all components directory
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // if using app directory
    "./styles/**/*.{css,scss}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {},
    },
  },
  plugins: [],
};
