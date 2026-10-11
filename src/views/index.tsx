import type { ComponentProps } from "../lib/ui";
import { classes } from "../lib/ui";
import { execSync } from "node:child_process";
import { getCollection } from "../lib/content";
import Layout from "../layouts/Layout";
import { Image } from "../lib/ui";
import { Icon } from "../lib/ui";
import merlin from "../assets/emojis/merlin.webp";
import jsonVisualiser from "../assets/icons/json-visualiser.png";
import markdownVisualizer from "../assets/icons/markdown-visualizer.png";
import IndexList from "../components/IndexList";
import AboutHeadline from "../components/AboutHeadline";
import GitHubChart from "../components/GitHubChart";
import {
  contactEmail,
  hostname,
  roles,
  siteLinks,
  talks,
} from "../data/portfolio";
import {
  buildOrganizationSchema,
  buildPersonSchema,
  buildProfilePageSchema,
  buildWebsiteSchema,
  siteConfig,
} from "../lib/seo";
import { getLocale, locales, localizePath, useTranslations } from "../i18n";
import { getLocalizedCollection } from "../i18n/content";
export default async function View(props: ComponentProps) {
  const context = props.context;
  const locale = getLocale(context.locale);
  const t = useTranslations(locale);
  const home = t.home;
  const projects = (await getLocalizedCollection("projects", locale)).sort(
    (a, b) => a.data.title.localeCompare(b.data.title),
  );
  const posts = (await getLocalizedCollection("posts", locale)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  const gists = await getCollection("gists");
  let updated = new Date();
  try {
    updated = new Date(execSync("git log -1 --format=%cI").toString().trim());
  } catch {}
  const dayMonth = (date: Date) =>
    date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });
  const years = (period: string) => {
    const [from, to] = period.split(" to ");
    const start = from!.slice(-4);
    const end = to === "present" ? home.now : to!.slice(-4);
    return start === end ? start : `${start} – ${end}`;
  };
  const jsonLd = [
    buildProfilePageSchema(context.site),
    buildPersonSchema(context.site),
    buildOrganizationSchema(context.site),
    buildWebsiteSchema(context.site),
  ];
  return (
    <>
      <Layout
        context={context}
        title={siteConfig.name}
        description={t.description}
        jsonLd={jsonLd}
      >
        <main className="stagger grid gap-12">
          <article className="grid min-w-0 gap-8" data-animated-about>
            <header className="grid gap-4">
              <p className="text-faint">
                {home.updated(
                  updated.toLocaleDateString(locales[locale].dateLocale, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
                )}
              </p>
              <AboutHeadline context={context} locale={locale} />
            </header>
            <div className="grid gap-4 text-base/7 sm:text-sm/6">
              <p className="text-pretty">
                {home.intro[0]}
                <a href="https://www.getmerlin.in/chat" className="chip">
                  <Image src={merlin} alt="" width={40} />
                  Merlin AI
                </a>
                {home.intro[1]}
                {t.city}
                {home.intro[2]}
              </p>
              <p className="text-pretty">
                {home.tools[0]}
                <a
                  href={localizePath("/project/json-visualiser", locale)}
                  className="chip"
                >
                  <Image src={jsonVisualiser} alt="" width={40} />
                  {home.jsonVisualiser}
                </a>
                {home.tools[1]}
                <a
                  href={localizePath("/project/markdown-visualizer", locale)}
                  className="chip"
                >
                  <Image src={markdownVisualizer} alt="" width={40} />
                  {home.markdownVisualizer}
                </a>
                {home.tools[2]}
              </p>
              <p className="text-pretty">
                {home.next[0]}
                <a href={siteLinks.github.href} className="chip">
                  <Icon name="ri:github-fill" />
                  GitHub
                </a>
                {home.next[1]}
                <a href={siteLinks.linkedin.href} className="chip">
                  <Icon name="ri:linkedin-box-fill" />
                  LinkedIn
                </a>
                {home.next[2]}
                <a href={siteLinks.x.href} className="chip">
                  <Icon name="ri:twitter-x-fill" />X
                </a>
                {home.next[3]}
                <a href={siteLinks.resume.pdf} className="chip">
                  <Icon name="ri:file-text-line" />
                  {home.resume}
                </a>
                {home.next[4]}
                <a href="https://cal.com/milind/15min" className="chip">
                  <Icon name="ri:calendar-line" />
                  {home.book}
                </a>
                {home.next[5]}
                <a href={`mailto:${contactEmail}`} className="chip">
                  <Icon name="ri:mail-line" />
                  {home.email}
                </a>
                {home.next[6]}
              </p>
            </div>
          </article>

          <IndexList
            context={context}
            title={home.projects}
            items={projects.map((project) => ({
              href: localizePath(`/project/${project.id}`, locale),
              title: project.data.title,
              meta: hostname(project.data.url),
            }))}
          />

          <IndexList
            context={context}
            title={home.writing}
            items={posts.map((post) => ({
              href: localizePath(`/blog/${post.id}`, locale),
              title: post.data.title,
              meta: dayMonth(post.data.date),
              group: String(post.data.date.getFullYear()),
            }))}
          />

          <IndexList
            context={context}
            title={home.work}
            items={roles.map((role) => ({
              href: localizePath("/work", locale),
              title: t.work.roles[role.company]?.company ?? role.company,
              meta: years(role.period),
            }))}
          />

          <GitHubChart context={context} />

          <IndexList
            context={context}
            title={home.talks}
            items={talks.map((talk) => ({
              href: talk.href,
              title: t.talks.items[talk.title]?.title ?? talk.title,
              meta: talk.date.slice(-4),
              external: true,
            }))}
          />

          <IndexList
            context={context}
            title={home.more}
            items={[
              {
                href: localizePath("/gist", locale),
                title: home.gists,
                meta: home.snippets(gists.length),
              },
              {
                href: localizePath("/uses", locale),
                title: home.uses,
                meta: home.usesMeta,
              },
              {
                href: localizePath("/contact", locale),
                title: home.contact,
                meta: home.contactMeta,
              },
              { href: "/docs", title: home.api, meta: home.apiMeta },
              { href: "/llms.txt", title: home.agent, meta: "llms.txt" },
            ]}
          />
        </main>
      </Layout>
    </>
  );
}
