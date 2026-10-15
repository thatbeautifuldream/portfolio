import AboutHeadline from "../../components/about-headline";
import Footer from "../../components/footer";
import CodeCopy from "../../components/code-copy";
import { getLocale, useTranslations, type Locale } from "../../i18n";
import { pageContext } from "../../lib/page";

export default async function PreviewSamples({
  sample,
  locale,
}: {
  sample: string;
  locale: Locale;
}) {
  const resolved = getLocale(locale);
  const context = pageContext("/canvas", resolved);
  const c = useTranslations(resolved).canvas;
  return (
    <main
      data-isolated-preview
      style={{ padding: "48px 8px 8px", overflow: "visible" }}
    >
      {sample === "about" && (
        <div data-animated-about data-variant="interactive-morph">
          <AboutHeadline context={context} locale={resolved} />
        </div>
      )}
      {sample === "footer" && <Footer context={context} />}
      {sample === "code" && (
        <>
          <div
            className="canvas-code-sample prose"
            data-variant="enhancement-lifecycle"
          >
            <pre>
              <code>{c.codeSample}</code>
            </pre>
          </div>
          <CodeCopy context={context} />
        </>
      )}
      {sample !== "footer" && (
        <button
          id="theme-toggle"
          type="button"
          hidden
          aria-label={useTranslations(resolved).footer.toggleTheme}
        />
      )}
    </main>
  );
}
