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
            __html: `(()=>{const scheme=matchMedia('(prefers-color-scheme: dark)');const apply=()=>{let stored;try{stored=localStorage.getItem('theme');}catch{}document.documentElement.classList.toggle('dark',stored==='dark'||(stored!=='light'&&scheme.matches));};apply();scheme.addEventListener('change',apply);})();`,
          }}
        />
        <link rel="sitemap" href="/sitemap-index.xml" />
      </head>
      <body className="bg-background text-foreground min-h-svh">
        <PwaRegistration />
        <ThemeTransition>{children}</ThemeTransition>
      </body>
    </html>
  );
}
