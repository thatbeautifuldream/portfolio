import AboutHeadline from "../../components/about-headline";
import PageHeader from "../../components/page-header";
import EmailLink from "../../components/email-link";
import Footer from "../../components/footer";
import IndexList from "../../components/index-list";
import SiteLink from "../../components/site-link";
import CodeCopy from "../../components/code-copy";
import { Icon, type SiteContext } from "../../lib/ui";
import {
  getLocale,
  localizePath,
  useTranslations,
  type Locale,
} from "../../i18n";
import { getLocalizedCollection } from "../../i18n/content";
import { pageContext } from "../../lib/page";
import type { ReactNode } from "react";
import { inventory } from "./inventory";
import ClientEnhancement from "../../components/client-enhancement";
import Canvas from "./canvas";

function Group({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="canvas-group" id={id}>
      <h2 className="canvas-group-title">{title}</h2>
      <div className="canvas-examples">{children}</div>
    </section>
  );
}

function Example({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div data-preview data-variant={name}>
      {children}
    </div>
  );
}

export default async function Samples({
  locale = "en",
  embedded = false,
}: {
  locale?: Locale;
  embedded?: boolean;
}) {
  const resolved = getLocale(locale);
  const context: SiteContext = pageContext("/canvas", resolved);
  const t = useTranslations(resolved);
  const c = t.canvas;
  const posts = (await getLocalizedCollection("posts", resolved)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  const indexItems = posts.slice(0, 4).map((post) => ({
    href: localizePath(`/blog/${post.id}`, resolved),
    title: post.data.title,
  }));
  const work = t.work;
  const home = t.home;

  return (
    <>
      <Canvas
        embedded={embedded}
        controlTips={c.controls}
        controlIcons={{
          zoomOut: <Icon name="ri:subtract-line" className="size-5" />,
          zoomIn: <Icon name="ri:add-line" className="size-5" />,
          fit: <Icon name="ri:fullscreen-line" className="size-5" />,
          reset: <Icon name="ri:restart-line" className="size-5" />,
          theme: (
            <>
              <Icon name="ri:moon-line" className="size-5 dark:hidden" />
              <Icon name="ri:sun-line" className="size-5 not-dark:hidden" />
            </>
          ),
        }}
      >
        <Group id="about" title={c.groups.about}>
          <Example name="localized-headline">
            <div className="canvas-about-sample" data-animated-about>
              <AboutHeadline context={context} locale={resolved} />
            </div>
          </Example>
        </Group>
        <Group id="page-header" title={c.groups.pageHeader}>
          <Example name="title">
            <PageHeader context={context} title={work.title} />
          </Example>
          <Example name="metadata">
            <PageHeader context={context} title={work.title} meta={work.meta} />
          </Example>
          <Example name="children">
            <PageHeader context={context} title={work.title}>
              <SiteLink href={localizePath("/blog", resolved)}>
                {home.writing}
              </SiteLink>
            </PageHeader>
          </Example>
        </Group>
        <Group id="index-list" title={c.groups.indexList}>
          <Example name="plain">
            <IndexList
              context={context}
              title={t.blog.posts}
              items={indexItems}
            />
          </Example>
        </Group>
        <Group id="code" title={c.groups.code}>
          <Example name="copy-code">
            <div
              className="canvas-code-sample prose"
              data-variant="enhancement-lifecycle"
            >
              <pre>
                <code>{c.codeSample}</code>
              </pre>
            </div>
            <CodeCopy context={context} />
          </Example>
        </Group>
        <Group id="email" title={c.groups.email}>
          <Example name="localized">
            <EmailLink context={context} />
          </Example>
        </Group>
        <Group id="footer" title={c.groups.footer}>
          <Example name="localized-footer">
            <Footer context={context} />
          </Example>
        </Group>
        <Group id="coverage" title={c.groups.coverage}>
          <div data-preview>
            <details>
              <summary>{c.omissionsSummary}</summary>
              <ul>
                {inventory
                  .filter((item) => "omitted" in item)
                  .map((item) => (
                    <li key={item.file}>
                      <strong>{item.file}</strong>:{" "}
                      {"omitted" in item && item.omitted}
                    </li>
                  ))}
              </ul>
              <p>{c.omissionsIntro}</p>
            </details>
          </div>
        </Group>
      </Canvas>
      <ClientEnhancement kind="tooltip" />
    </>
  );
}
