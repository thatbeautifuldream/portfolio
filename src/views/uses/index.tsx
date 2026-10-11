import { Fragment } from "react";
import type { ComponentProps } from "../../lib/ui";
import { classes } from "../../lib/ui";
import Layout from "../../layouts/Layout";
import PageHeader from "../../components/PageHeader";
import IndexList from "../../components/IndexList";
import { hostname } from "../../data/portfolio";
import { absoluteUrl, buildPersonRef, siteConfig } from "../../lib/seo";
import { getLocale, localizePath, useTranslations } from "../../i18n";
import { getLocalizedCollection } from "../../i18n/content";
export default async function View(props: ComponentProps) {
  const context = props.context;
  const locale = getLocale(context.locale);
  const t = useTranslations(locale).uses;
  const items = (await getLocalizedCollection("uses", locale)).sort((a, b) =>
    a.data.title.localeCompare(b.data.title),
  );
  const categoryOrder = ["Development", "Apps", "Design", "Services"];
  const logo = String.raw`                    ..'
                 ,xNMM.
               .OMMMMo
               lMM"
     .;loddo:.  .olloddol;.
   cKMMMMMMMMMMNWMMMMMMMMMM0:
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.
 XMMMMMMMMMMMMMMMMMMMMMMMX.
;MMMMMMMMMMMMMMMMMMMMMMMM:
:MMMMMMMMMMMMMMMMMMMMMMMM:
.MMMMMMMMMMMMMMMMMMMMMMMMX.
 kMMMMMMMMMMMMMMMMMMMMMMMMWd.
 'XMMMMMMMMMMMMMMMMMMMMMMMMMMk
  'XMMMMMMMMMMMMMMMMMMMMMMMMK.
    kMMMMMMMMMMMMMMMMMMMMMMd
     ;KMMMMMMMWXXWMMMMMMMk.
       "cooc*"    "*coo'"`;
  const specs = [
    ["OS", "macOS Tahoe 26.6"],
    ["Host", "MacBook Pro (16″, 2021)"],
    ["Kernel", "Darwin 25.6.0"],
    ["Shell", "zsh 5.9"],
    ["Display", "3456×2234 @ 120 Hz"],
    ["CPU", "Apple M1 Pro (10-core)"],
    ["GPU", "Apple M1 Pro (16-core)"],
    ["Memory", "16 GB"],
    ["Disk", "460 GB"],
    ["Packages", "283 (brew)"],
  ];
  const swatches = [
    "bg-foreground/6",
    "bg-foreground/25",
    "bg-foreground/45",
    "bg-foreground/70",
    "bg-foreground",
  ];
  const categories = [...new Set(items.map((item) => item.data.category))].sort(
    (a, b) => {
      const ai = categoryOrder.indexOf(a);
      const bi = categoryOrder.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    },
  );
  const grouped = categories.map((category) => ({
    category,
    items: items.filter((item) => item.data.category === category),
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${siteConfig.shortName} - Uses`,
    description: t.description,
    url: absoluteUrl(localizePath("/uses", locale), context.site),
    author: buildPersonRef(context.site),
  };
  return (
    <>
      <Layout context={context} jsonLd={jsonLd}>
        <main className="stagger grid gap-12">
          <article className="grid gap-4">
            <PageHeader context={context} title={t.title} meta={t.meta} />
            <p className="text-pretty">{t.body}</p>
          </article>
          <section className="grid min-w-0 gap-4">
            <h2 className="section-title">{t.machine}</h2>
            <div className="bg-muted border-rule flex gap-8 overflow-x-auto rounded-lg border p-4 font-mono text-sm/5 sm:text-[0.8125rem]/5">
              <pre
                aria-hidden="true"
                className="text-faint shrink-0 max-sm:hidden"
              >
                {logo}
              </pre>
              <div className="grid min-w-0 content-start gap-3">
                <div>
                  <p>milind@macbook-pro</p>
                  <p className="text-faint" aria-hidden="true">
                    ------------------
                  </p>
                </div>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 whitespace-nowrap">
                  {specs.map(([term, detail]) => (
                    <Fragment key={term}>
                      <dt className="font-medium">{term}</dt>
                      <dd className="text-muted-foreground">{detail}</dd>
                    </Fragment>
                  ))}
                </dl>
                <div className="flex gap-1" aria-hidden="true">
                  {swatches.map((swatch) => (
                    <span
                      key={swatch}
                      className={classes([
                        swatch,
                        "size-3 rounded-[0.1875rem]",
                      ])}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
          {grouped.map(({ category, items: categoryItems }) => (
            <IndexList
              key={category}
              context={context}
              title={t.categories[category] ?? category}
              items={categoryItems.map((item) => ({
                href: localizePath(`/uses/${item.id}`, locale),
                title: item.data.title,
                meta: item.data.url ? hostname(item.data.url) : undefined,
              }))}
            />
          ))}
        </main>
      </Layout>
    </>
  );
}
