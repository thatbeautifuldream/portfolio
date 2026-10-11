import type { ComponentProps } from "../lib/ui";
import { classes } from "../lib/ui";
import Layout from "../layouts/Layout";
import PageHeader from "../components/PageHeader";
import { roles } from "../data/portfolio";
import { absoluteUrl, buildPersonRef, siteConfig } from "../lib/seo";
import { getLocale, localizePath, useTranslations } from "../i18n";
export default async function View(props: ComponentProps) {
  const context = props.context;
  const locale = getLocale(context.locale);
  const t = useTranslations(locale).work;
  const pageUrl = absoluteUrl(localizePath("/work", locale), context.site);
  const localizedRoles = roles.map((role) => ({
    ...role,
    ...t.roles[role.company],
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${t.schemaName} · ${siteConfig.name}`,
    description: t.description,
    url: pageUrl,
    author: buildPersonRef(context.site),
    hasPart: localizedRoles.map((role) => ({
      "@type": "OrganizationRole",
      roleName: role.role,
      worksFor: { "@type": "Organization", name: role.company },
    })),
  };
  return (
    <>
      <Layout
        context={context}
        title={t.title}
        description={t.description}
        jsonLd={jsonLd}
      >
        <main className="stagger grid gap-12">
          <article className="grid gap-4">
            <PageHeader context={context} title={t.title} meta={t.meta} />
            {t.body.map((paragraph) => (
              <p key={paragraph} className="text-pretty">
                {paragraph}
              </p>
            ))}
          </article>

          {localizedRoles.map((role) => (
            <section key={role.company} className="grid gap-4">
              <h2 className="section-title">{role.company}</h2>
              <div className="grid gap-1">
                <p className="font-semibold">{role.role}</p>
                <p className="text-faint">
                  {role.period} · {role.location}
                </p>
              </div>
              <p className="text-pretty">{role.summary}</p>
              <div className="prose text-muted-foreground">
                <ul>
                  {role.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </main>
      </Layout>
    </>
  );
}
