import type { Locale } from "../i18n";

export const aboutCopy = {
  en: {
    greeting: "Hi, I'm Milind.",
    before: "I think in",
    between: "build with",
    after: "and care about",
    subjects: ["interfaces", "systems", "possibilities"],
    tools: ["React", "Next.js", "TanStack", "Expo"],
    qualities: ["how it feels", "the little details", "the human side"],
    changeSubject: "Explore how I think",
    changeTool: "Explore my tools",
    changeQuality: "Explore what I care about",
  },
  hi: {
    greeting: "नमस्ते, मैं मिलिंद हूँ।",
    before: "मैं सोचता हूँ",
    between: " में, बनाता हूँ",
    after: " से, और परवाह करता हूँ",
    subjects: ["इंटरफ़ेस", "सिस्टम", "संभावनाओं"],
    tools: ["React", "Next.js", "TanStack", "Expo"],
    qualities: ["अनुभव की", "बारीकियों की", "इंसानी पहलू की"],
    changeSubject: "मेरी सोच जानें",
    changeTool: "मेरे टूल जानें",
    changeQuality: "मेरी प्राथमिकताएँ जानें",
  },
} satisfies Record<Locale, object>;
