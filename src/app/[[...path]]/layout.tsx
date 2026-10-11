import ThemeTransition from "../../components/ThemeTransition";
import "../../styles/global.css";
import "../../styles/components.css";
import "../../styles/fonts.css";
import type { ReactNode } from "react";
import { siteConfig } from "../../lib/seo";
export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ path?: string[] }>;
}) {
  const { path = [] } = await params;
  const locale = path[0] === "hi" ? "hi" : "en";
  return (
    <html lang={locale} className="antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{const scheme=matchMedia('(prefers-color-scheme: dark)');const apply=()=>{let stored;try{stored=localStorage.getItem('theme');}catch{}document.documentElement.classList.toggle('dark',stored==='dark'||(stored!=='light'&&scheme.matches));};apply();scheme.addEventListener('change',apply);})();`,
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="48x48 32x32 16x16" />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        {path[0] !== "docs" && (
          <meta name="theme-color" content={siteConfig.themeColor} />
        )}
        <link rel="sitemap" href="/sitemap-index.xml" />
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prerender: [
                {
                  source: "document",
                  where: {
                    and: [
                      { href_matches: "/*" },
                      { not: { href_matches: "/*\\?*" } },
                      { not: { selector_matches: '[rel~="nofollow"]' } },
                    ],
                  },
                  eagerness: "moderate",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="bg-background text-foreground min-h-svh">
        <ThemeTransition>{children}</ThemeTransition>
      </body>
    </html>
  );
}
