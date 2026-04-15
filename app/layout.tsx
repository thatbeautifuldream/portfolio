import { Footer } from "@/components/portfolio/footer"
import { Navigation } from "@/components/portfolio/navigation"
import { QueryProvider } from "@/components/query-provider"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import "./globals.css"

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
      <body className="min-h-svh bg-background font-sans text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
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
