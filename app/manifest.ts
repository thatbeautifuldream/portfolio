import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Milind Kumar Mishra",
    short_name: "Milind",
    description:
      "Product engineer building AI-native interfaces, product systems, and tools people return to.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/icons/Icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/Icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/Icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
