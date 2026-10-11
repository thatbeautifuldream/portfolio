import Content from "../../components/Content";
import type { ComponentProps } from "../../lib/ui";
import ClientScript from "../../components/ClientScript";
import { Image } from "../../lib/ui";
import { Icon } from "../../lib/ui";
import Layout from "../../layouts/Layout";
import CodeCopy from "../../components/CodeCopy";
import PageHeader from "../../components/PageHeader";
import { buildPersonRef } from "../../lib/seo";
import { getLocale, locales, useTranslations } from "../../i18n";
export default async function View(props: ComponentProps) {
  const context = props.context;
  const { post } = props;
  const locale = getLocale(context.locale);
  const t = useTranslations(locale).blog;
  function formatDate(date: Date): string {
    return date.toLocaleDateString(locales[locale].dateLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.data.title,
    description: post.data.description,
    author: buildPersonRef(context.site),
    datePublished: post.data.date.toISOString(),
    dateModified: post.data.date.toISOString(),
  };
  return (
    <>
      <Layout context={context} jsonLd={jsonLd}>
        <main>
          <article className="stagger grid min-w-0 gap-8">
            <PageHeader
              context={context}
              title={post.data.title}
              meta={`${post.data.category} · ${formatDate(post.data.date)}`}
            >
              <button
                type="button"
                data-share
                className="text-faint hover:text-foreground relative inline-flex w-fit cursor-pointer items-center gap-1.5"
              >
                <Icon
                  name="ri:share-forward-line"
                  className="size-5 shrink-0 sm:size-4"
                />
                <span data-share-label>{t.share}</span>
                <span
                  className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
                  aria-hidden="true"
                ></span>
              </button>
            </PageHeader>
            {post.data.coverImage && (
              <Image
                src={post.data.coverImage}
                alt=""
                className="w-full rounded-lg outline-1 -outline-offset-1 outline-black/5 dark:outline-white/10"
              />
            )}
            <Content className="prose min-w-0" html={post.html} />
          </article>
        </main>
        <CodeCopy context={context} />
      </Layout>

      <ClientScript
        id="src/views/blog/[slug].tsx:0"
        code={
          '"use strict";\nconst milestones = [25, 50, 75, 100];\nconst fired = new Set();\nfunction onScroll() {\n    const doc = document.documentElement;\n    const scrollable = doc.scrollHeight - innerHeight;\n    const percent = scrollable <= 0 ? 100 : (scrollY / scrollable) * 100;\n    for (const m of milestones) {\n        if (percent >= m && !fired.has(m)) {\n            fired.add(m);\n            window.posthog?.capture("blog_read_depth", {\n                post_slug: slug,\n                post_title: title,\n                depth: m,\n            });\n        }\n    }\n    if (fired.size === milestones.length) {\n        removeEventListener("scroll", onScroll);\n    }\n}\naddEventListener("scroll", onScroll, { passive: true });\nonScroll();\n// Fetch the story image up front: Safari only opens the share sheet if\n// navigator.share runs right after the tap, without awaiting a download.\nlet story;\nif (navigator.canShare) {\n    fetch(`${sharePrefix}/${slug}.png`)\n        .then((res) => res.blob())\n        .then((blob) => {\n        story = new File([blob], `${slug}.png`, { type: "image/png" });\n    })\n        .catch(() => { });\n}\nconst button = document.querySelector("[data-share]");\nconst label = button.querySelector("[data-share-label]");\nbutton.addEventListener("click", async () => {\n    const url = location.origin + location.pathname;\n    const files = story ? [story] : [];\n    try {\n        if (files.length && navigator.canShare?.({ files })) {\n            await navigator.share({ files, title, text: `${title} ${url}` });\n            window.posthog?.capture("blog_shared", {\n                post_slug: slug,\n                method: "story",\n            });\n        }\n        else if (navigator.share) {\n            await navigator.share({ title, url });\n            window.posthog?.capture("blog_shared", {\n                post_slug: slug,\n                method: "link",\n            });\n        }\n        else {\n            await navigator.clipboard.writeText(url);\n            window.posthog?.capture("blog_shared", {\n                post_slug: slug,\n                method: "copy",\n            });\n            label.textContent = copiedLabel;\n            setTimeout(() => (label.textContent = shareLabel), 2000);\n        }\n    }\n    catch { }\n});\n'
        }
        vars={{
          slug: post.id,
          title: post.data.title,
          shareLabel: t.share,
          copiedLabel: t.linkCopied,
          sharePrefix: locale === "en" ? "/share" : `/share/${locale}`,
        }}
      />
    </>
  );
}
