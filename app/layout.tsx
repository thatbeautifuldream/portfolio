import { Footer } from "@/components/portfolio/footer"
import { Navigation } from "@/components/portfolio/navigation"
import { CommandPalette } from "@/components/command-palette"
import { QueryProvider } from "@/components/query-provider"
import { ServiceWorkerProvider } from "@/components/service-worker-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { AnalyticsProvider } from "@/components/providers/analytics-provider"
import { JsonLd } from "@/components/json-ld"
import localFont from "next/font/local"
import type { Metadata, Viewport } from "next"
import "react-tweet/theme.css"
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
  metadataBase: new URL("https://milindmishra.com"),
  title: {
    default: "Milind Kumar Mishra",
    template: "%s · Milind Kumar Mishra",
  },
  description:
    "Product engineer building AI-native interfaces, product systems, and independent tools with sharper interaction quality.",
  keywords: [
    "Milind Kumar Mishra",
    "product engineer",
    "design engineer",
    "AI-native interfaces",
    "React",
    "TypeScript",
    "motion design",
    "interaction design",
    "frontend engineering",
    "software engineer",
    "Bengaluru",
  ],
  authors: [{ name: "Milind Kumar Mishra", url: "https://milindmishra.com" }],
  creator: "Milind Kumar Mishra",
  publisher: "Milind Kumar Mishra",
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  openGraph: {
    siteName: "Milind Kumar Mishra",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@milindmishra_",
  },
  icons: {
    icon: "/favicon.ico",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

const SITE_URL = "https://milindmishra.com"

const rootSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Milind Kumar Mishra",
      alternateName: "Milind Mishra",
      url: SITE_URL,
      jobTitle: "Product Engineer / Design Engineer",
      sameAs: [
        "https://github.com/thatbeautifuldream",
        "https://www.linkedin.com/in/mishramilind/",
        "https://x.com/milindmishra_",
      ],
      image: `${SITE_URL}/api/og?type=home`,
    },
    {
      "@type": "WebSite",
      name: "Milind Kumar Mishra",
      url: SITE_URL,
      description:
        "Product engineer building AI-native interfaces, product systems, and independent tools with sharper interaction quality.",
      image: `${SITE_URL}/api/og?type=home`,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
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
      <head>
        <link rel="llms-txt" href={`${SITE_URL}/llms.txt`} />
        <link
          rel="alternate"
          type="text/markdown"
          href={`${SITE_URL}/llms-full.txt`}
          title="Agent-Friendly Full Content"
        />
      </head>
      <body
        className={`min-h-svh bg-background font-sans text-foreground ${openRunde.className}`}
      >
        <JsonLd data={rootSchema} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <AnalyticsProvider />
          <CommandPalette />
          <QueryProvider>
            <ServiceWorkerProvider />
            <Navigation />
            {children}
            <Footer />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
