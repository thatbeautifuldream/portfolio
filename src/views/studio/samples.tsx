import PageHeader from "../../components/page-header";
import Content from "../../components/content";
import EmailLink from "../../components/email-link";
import IndexList from "../../components/index-list";
import SiteLink from "../../components/site-link";
import IsolatedPreview from "./isolated-preview";
import { Icon, Image, type SiteContext } from "../../lib/ui";
import type { Locale } from "../../i18n";
import type { ReactNode } from "react";
import { inventory } from "./inventory";
import Canvas from "./canvas";
import { getStudioImages, imageGroups } from "./images";

function contextFor(locale: Locale): SiteContext {
  return {
    locale,
    url: new URL("http://localhost/"),
    site: new URL("http://localhost"),
  };
}

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
      <p className="canvas-example-label">{name}</p>
      {children}
    </div>
  );
}

export default async function Samples({ locale = "en" }: { locale?: Locale }) {
  const context = contextFor(locale);
  const gallery = imageGroups(await getStudioImages());
  const items = [
    { title: "Interface study", href: "#page-header" },
    { title: "Component notes", href: "#content" },
  ];
  const article =
    "<h2>Component notes</h2><p>Real typography, <strong>emphasis</strong>, and <a href='#page-header'>a group link</a>.</p><blockquote>Small details make an interface feel complete.</blockquote><ul><li>Accessible controls</li><li>Useful content</li></ul>";
  return (
    <Canvas>
      <Group id="about" title="AboutHeadline · AboutMotion">
        <Example name="localized-headline">
          <IsolatedPreview sample="about" locale={locale} />
        </Example>
      </Group>
      <Group id="page-header" title="PageHeader">
        <Example name="title">
          <PageHeader context={context} title="Selected work" />
        </Example>
        <Example name="metadata">
          <PageHeader
            context={context}
            title="Selected work"
            meta="Product engineering · 2026"
          />
        </Example>
        <Example name="children">
          <PageHeader context={context} title="Selected work">
            <SiteLink href="#index-list">Explore the collection</SiteLink>
          </PageHeader>
        </Example>
      </Group>
      <Group id="index-list" title="IndexList">
        <Example name="plain">
          <IndexList context={context} title="Collection" items={items} />
        </Example>
        <Example name="metadata">
          <IndexList
            context={context}
            title="Collection"
            items={items.map((item) => ({ ...item, meta: "2026" }))}
          />
        </Example>
        <Example name="grouped">
          <IndexList
            context={context}
            title="Collection"
            items={items.map((item) => ({ ...item, group: "2026" }))}
          />
        </Example>
        <Example name="external">
          <IndexList
            context={context}
            title="Collection"
            items={items.map((item) => ({ ...item, external: true }))}
          />
        </Example>
        <Example name="empty">
          <IndexList context={context} title="Collection" items={[]} />
        </Example>
      </Group>
      <Group id="links" title="SiteLink">
        <Example name="internal">
          <SiteLink href="/work/">Selected work</SiteLink>
        </Example>
        <Example name="external">
          <SiteLink
            href="https://example.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Selected work
          </SiteLink>
        </Example>
        <Example name="hash">
          <SiteLink href="#page-header">Selected work</SiteLink>
        </Example>
        <Example name="download">
          <SiteLink href="/index.md" download>
            Selected work
          </SiteLink>
        </Example>
        <Example name="email">
          <SiteLink href="mailto:canvas@example.invalid">
            Selected work
          </SiteLink>
        </Example>
      </Group>
      <Group id="content" title="Content">
        <Example name="html">
          <Content className="prose" html={article} />
        </Example>
        <Example name="image-html">
          <Content
            className="prose"
            html={
              article +
              '<img src="/icons/about/react-light.svg" width="36" height="36" alt="React logo" />'
            }
          />
        </Example>
      </Group>
      <Group id="code" title="CodeCopy · ClientEnhancement">
        <Example name="copy-code">
          <IsolatedPreview sample="code" locale={locale} />
        </Example>
      </Group>
      <Group id="email" title="EmailLink">
        <Example name="english">
          <EmailLink context={contextFor("en")} />
        </Example>
        <Example name="hindi">
          <EmailLink context={contextFor("hi")} />
        </Example>
      </Group>
      <Group id="tooltip" title="Tooltip">
        <Example name="label">
          <IsolatedPreview sample="tooltip" locale={locale} />
        </Example>
        <Example name="metadata">
          <IsolatedPreview sample="tooltip-meta" locale={locale} />
        </Example>
      </Group>
      <Group id="icons" title="Icon">
        <Example name="inline">
          <Icon name="ri:github-fill" />
        </Example>
        <Example name="small">
          <Icon name="ri:github-fill" className="size-4" />
        </Example>
        <Example name="large">
          <Icon name="ri:github-fill" className="size-6" />
        </Example>
        <Example name="accessible">
          <Icon name="ri:github-fill" role="img" aria-label="GitHub" />
        </Example>
      </Group>
      <Group id="images" title="Image">
        <Example name="optimized">
          <Image
            src={{
              src: "/content-assets/4-years-later.jpg",
              width: 1250,
              height: 500,
            }}
            width={260}
            alt="Article illustration"
          />
        </Example>
        <Example name="intrinsic">
          <Image
            src={{ src: "/icons/about/react-light.svg", width: 36, height: 36 }}
            alt="React logo"
          />
        </Example>
        <Example name="fallback">
          <Image
            src="/icons/about/react-light.svg"
            alt="React logo"
            style={{ width: 36 }}
          />
        </Example>
      </Group>
      <Group id="footer" title="Footer">
        <Example name="localized-footer">
          <IsolatedPreview sample="footer" locale={locale} />
        </Example>
      </Group>
      <Group id="theme" title="ThemeTransition · Coverage">
        <Example name="light-dark">
          <p>
            The document uses the real ThemeTransition. Use the moon/sun button
            in the toolbar or footer.
          </p>
        </Example>
        <div data-preview>
          <details>
            <summary>Nonvisual and live-service omissions</summary>
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
            <p>
              DocumentLayout is the real host. Layout and full page views are
              excluded: Layout mounts trackers, and pages compose these same
              components, sometimes with live data. No modal or portal
              components exist in this project.
            </p>
          </details>
        </div>
      </Group>
      {gallery.map((group) => (
        <Group key={group.id} id={group.id} title={group.title}>
          {group.images.map((image, imageIndex) => (
            <figure
              data-preview
              data-studio-image={image.src}
              key={image.src}
              id={`${group.id}-image-${imageIndex + 1}`}
            >
              <SiteLink
                href={`#${group.id}-image-${imageIndex + 1}`}
                aria-label={`Inspect ${image.locale.toUpperCase()} ${image.kind}: ${image.title}`}
              >
                <Image
                  src={image.src}
                  width={279}
                  height={Math.round((279 * image.height) / image.width)}
                  alt={image.title}
                  unoptimized
                  style={{ width: "100%", height: "auto" }}
                />
              </SiteLink>
              <figcaption className="studio-image-caption">
                <strong>{image.title}</strong>
                <span>
                  {image.locale.toUpperCase()} · {image.width} × {image.height}
                </span>
                <code>{image.src}</code>
              </figcaption>
            </figure>
          ))}
        </Group>
      ))}
    </Canvas>
  );
}
