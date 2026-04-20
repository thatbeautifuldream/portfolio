import { Footer } from "@/components/portfolio/footer"
import { Navigation } from "@/components/portfolio/navigation"
import { QueryProvider } from "@/components/query-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { AnalyticsProvider } from "@/components/providers/analytics-provider"
import localFont from "next/font/local"
import type { Metadata } from "next"
import "./globals.css"

const openRunde = localFont({
  src: [
    {
      path: "../fonts/OpenRunde-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/OpenRunde-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/OpenRunde-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/OpenRunde-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
})

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
    <html
      lang="en"
      suppressHydrationWarning
      className={`antialiased scheme-only-dark ${openRunde.variable}`}
    >
      <body
        className={`min-h-svh bg-background font-sans text-foreground ${openRunde.className}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <AnalyticsProvider />
          <QueryProvider>
            <Navigation />
            {children}
            <Footer />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
