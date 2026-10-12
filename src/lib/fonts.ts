import localFont from "next/font/local";
export const inter = localFont({
  src: [
    {
      path: "../../public/fonts/InterVariable-latin.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../public/fonts/InterVariable-Italic-latin.woff2",
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
