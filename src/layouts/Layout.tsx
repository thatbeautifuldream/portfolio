import SiteLink from "../components/SiteLink";
import Footer from "../components/Footer";
import Analytics from "../components/Analytics";
import PostHog from "../components/posthog";
import ClientScript from "../components/ClientScript";
import { Icon, type ComponentProps } from "../lib/ui";
import { buildPersonSchema, buildWebsiteSchema } from "../lib/seo";
import { localizePath, stripLocale, useTranslations } from "../i18n";
export default async function Layout(props: ComponentProps) {
  const { context } = props,
    locale = context.locale,
    t = useTranslations(locale),
    path = stripLocale(context.url.pathname);
  const { jsonLd, back: backProp } = props;
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
  const structuredData = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [buildPersonSchema(context.site), buildWebsiteSchema(context.site)];
  return (
    <>
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
          <SiteLink
            href={back.href}
            data-back-link
            className="text-faint hover:text-foreground relative z-20 inline-flex w-fit items-center gap-1.5 no-underline xl:fixed xl:top-20 xl:left-20"
          >
            <Icon
              name="ri:arrow-go-back-line"
              className="size-5 shrink-0 sm:size-4"
            />
            {back.label}
          </SiteLink>
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
