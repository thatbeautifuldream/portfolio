import localFont from "next/font/local";
export const inter = localFont({
  src: [
    {
      path: "../../public/fonts/e868cdf4720e9ea5.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../public/fonts/91753f8d8da3aeb7.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["InterMetricFallback"],
});
export const devanagari = localFont({
  src: [
    {
      path: "../../public/fonts/1936aba715ddbe98.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-devanagari",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["DevanagariMetricFallback"],
  preload: false,
});
