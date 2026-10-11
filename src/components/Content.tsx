import { fromHtml } from "hast-util-from-html";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Image } from "../lib/ui";

// Parse authored HTML only on the server so article images become hydrated
// Next Images, rather than placeholders stranded in dangerouslySetInnerHTML.
export default function Content({
  html,
  className,
}: {
  html: string;
  className: string;
}) {
  if (!html.includes("<img")) {
    return (
      <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
    );
  }
  return (
    <div className={className}>
      {toJsxRuntime(fromHtml(html, { fragment: true }), {
        Fragment,
        jsx,
        jsxs,
        components: { img: Image },
      })}
    </div>
  );
}
