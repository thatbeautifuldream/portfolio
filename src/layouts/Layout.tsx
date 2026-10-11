import Footer from "../components/Footer";
import Analytics from "../components/Analytics";
import PostHog from "../components/posthog";
import ClientScript from "../components/ClientScript";
import { Icon, type ComponentProps } from "../lib/ui";
import {
  absoluteUrl,
  buildPersonSchema,
  buildWebsiteSchema,
  defaultKeywords,
  siteConfig,
} from "../lib/seo";
import {
  isTranslated,
  locales,
  localizePath,
  stripLocale,
  useTranslations,
  type Locale,
} from "../i18n";
export default async function Layout(props: ComponentProps) {
  const { context } = props,
    locale = context.locale,
    t = useTranslations(locale),
    path = stripLocale(context.url.pathname);
  const {
    title = siteConfig.name,
    description = t.description,
    canonical,
    keywords,
    image = locale === "en" ? siteConfig.defaultImage : "/og/hi.png",
    jsonLd,
    back: backProp,
  } = props;
  const segments = path.split("/").filter(Boolean),
    parent = segments.at(-2);
  const sectionTitles: Record<string, string> = {
    blog: t.blog.title,
    gist: t.gist.title,
    project: t.project.title,
    uses: t.uses.title,
  };
  const back =
    backProp ??
    (segments.length > 0 && {
      href: localizePath(
        parent ? `/${segments.slice(0, -1).join("/")}` : "/",
        locale,
      ),
      label: parent
        ? (locale !== "en" && sectionTitles[parent]) ||
          parent[0]!.toUpperCase() + parent.slice(1)
        : t.back.index,
    });
  const canonicalUrl =
      canonical ?? new URL(context.url.pathname, context.site).href,
    canonicalPath = stripLocale(new URL(canonicalUrl).pathname);
  const alternates = isTranslated(path)
    ? (Object.keys(locales) as Locale[]).map((lang) => ({
        lang,
        href: new URL(localizePath(canonicalPath, lang), context.site).href,
      }))
    : [];
  const fullTitle =
    title === siteConfig.name
      ? `${siteConfig.shortName} · ${t.tagline}`
      : `${siteConfig.shortName} · ${title}`;
  const ogImage = absoluteUrl(image, context.site),
    robots =
      "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
  const structuredData = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [buildPersonSchema(context.site), buildWebsiteSchema(context.site)];
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content={(keywords ?? defaultKeywords).join(", ")}
      />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta name="application-name" content={siteConfig.name} />
      <meta name="format-detection" content="telephone=no" />
      <link rel="canonical" href={canonicalUrl} />
      {alternates.map(({ lang, href }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={href} />
      ))}
      {alternates.length > 0 && (
        <link rel="alternate" hrefLang="x-default" href={alternates[0]!.href} />
      )}
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`${siteConfig.shortName} · Blog`}
        href={new URL("rss.xml", context.site).href}
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content={locales[locale].ogLocale} />
      {alternates
        .filter((a) => a.lang !== locale)
        .map((a) => (
          <meta
            key={a.lang}
            property="og:locale:alternate"
            content={locales[a.lang].ogLocale}
          />
        ))}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta
        property="og:image:alt"
        content={`${siteConfig.name}: ${t.tagline}`}
      />
      <meta
        property="og:logo"
        content={absoluteUrl("/icons/Icon-192.png", context.site)}
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content={siteConfig.twitter} />
      {structuredData.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replaceAll("<", "\\u003c"),
          }}
        />
      ))}
      <div
        aria-hidden="true"
        className="top-fade pointer-events-none fixed inset-x-0 top-0 z-10 h-10 md:h-32"
      />
      <div className="isolate mx-auto flex min-h-svh max-w-[36.375rem] flex-col gap-10 px-6 pt-8 md:px-4 md:pt-20">
        {back && (
          <a
            href={back.href}
            data-back-link
            className="text-faint hover:text-foreground relative z-20 inline-flex w-fit items-center gap-1.5 no-underline xl:fixed xl:top-20 xl:left-20"
          >
            <Icon
              name="ri:arrow-go-back-line"
              className="size-5 shrink-0 sm:size-4"
            />
            {back.label}
          </a>
        )}
        <div className="grow">{props.children}</div>
        <Footer context={context} />
      </div>
      <Analytics context={context} />
      <PostHog context={context} />
      <ClientScript
        id="external-links"
        code={`for(const link of document.querySelectorAll('a[href]'))if(link.protocol.startsWith('http')&&link.origin!==location.origin&&!link.hasAttribute('download')){link.target='_blank';link.rel='noopener noreferrer';}document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&!e.altKey&&!e.shiftKey&&e.key.toLowerCase()==='d'){e.preventDefault();document.getElementById('theme-toggle')?.click();}});`}
      />
    </>
  );
}
