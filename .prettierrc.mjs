/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/styles/global.css",
  printWidth: 80,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  useTabs: false,
  tabWidth: 2,
};
