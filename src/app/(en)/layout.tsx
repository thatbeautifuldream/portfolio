import type { ReactNode } from "react";
import DocumentLayout from "../../layouts/document-layout";
import { siteConfig } from "../../lib/seo";
import type { Metadata, Viewport } from "next";
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48 32x32 16x16" },
      { url: "/favicon-96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};
export const viewport: Viewport = { themeColor: siteConfig.themeColor };
export default function RootLayout({ children }: { children: ReactNode }) {
  return <DocumentLayout locale="en">{children}</DocumentLayout>;
}
