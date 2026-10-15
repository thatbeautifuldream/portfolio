import PwaRegistration from "../components/pwa-registration";
import ThemeTransition from "../components/theme-transition";
import "../styles/global.css";
import "../styles/components.css";
import "../styles/fonts.css";
import { inter, devanagari } from "../lib/fonts";
import type { Locale } from "../i18n";
import type { ReactNode } from "react";
export default function DocumentLayout({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${devanagari.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{const scheme=matchMedia('(prefers-color-scheme: dark)');const viewport=document.querySelector('meta[name="viewport"]');if(viewport&&!viewport.content.includes('viewport-fit'))viewport.content+=', viewport-fit=cover';const apply=()=>{let stored;try{stored=localStorage.getItem('theme');}catch{}const dark=stored==='dark'||(stored!=='light'&&scheme.matches);document.documentElement.classList.toggle('dark',dark);document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#111111':'#fdfdfc');};apply();scheme.addEventListener('change',apply);})();`,
          }}
        />
        <link rel="sitemap" href="/sitemap-index.xml" />
      </head>
      <body className="min-h-svh bg-background text-foreground">
        <PwaRegistration />
        <div aria-hidden="true" className="edge-top" />
        <ThemeTransition>{children}</ThemeTransition>
        <div aria-hidden="true" className="edge-bottom" />
      </body>
    </html>
  );
}
