import AboutHeadline from "../../components/about-headline";
import Footer from "../../components/footer";
import Tooltip from "../../components/tooltip";
import CodeCopy from "../../components/code-copy";
import type { Locale } from "../../i18n";

export default function PreviewSamples({
  sample,
  locale,
}: {
  sample: string;
  locale: Locale;
}) {
  const context = {
    locale,
    url: new URL("http://localhost/"),
    site: new URL("http://localhost"),
  };
  return (
    <main data-isolated-preview style={{ padding: "48px 8px 8px" }}>
      {sample === "about" && (
        <div data-animated-about data-variant="interactive-morph">
          <AboutHeadline context={context} locale={locale} />
        </div>
      )}
      {sample === "footer" && <Footer context={context} />}
      {sample === "code" && (
        <>
          <div className="prose" data-variant="enhancement-lifecycle">
            <pre>
              <code>
                {
                  'const message = "Hello, canvas";\nconsole.log(message, "This deliberately long fixture exercises native horizontal code scrolling without moving the camera.");'
                }
              </code>
            </pre>
          </div>
          <CodeCopy context={context} />
        </>
      )}
      {sample.startsWith("tooltip") && (
        <Tooltip context={context}>
          <button
            type="button"
            data-tip="Component details"
            data-tip-meta={sample === "tooltip-meta" ? "2026" : undefined}
          >
            Hover for details
          </button>
        </Tooltip>
      )}
      {sample !== "footer" && (
        <button
          id="theme-toggle"
          type="button"
          hidden
          aria-label="Toggle preview theme"
        />
      )}
    </main>
  );
}
