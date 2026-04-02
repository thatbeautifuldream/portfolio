import type { Metadata } from "next"
import Script from "next/script"

import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: {
    default: "Milind Kumar Mishra",
    template: "%s · Milind Kumar Mishra",
  },
  description:
    "Product engineer building AI-native interfaces, product systems, and independent tools with sharper interaction quality.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <head>
        <link rel="preconnect" href="https://rsms.me" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="min-h-svh bg-background font-sans text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
        <Script src="https://ui.sh/ui-picker.js" />
      </body>
    </html>
  )
}
