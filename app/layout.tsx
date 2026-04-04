import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { MobileNav } from "@/components/portfolio/mobile-nav"
import "./globals.css"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
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
      className={`${fontSans.variable} antialiased`}
    >
      <body className="min-h-svh bg-background font-sans text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <MobileNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
