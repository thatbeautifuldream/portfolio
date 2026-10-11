import Link from "next/link";
import type { ComponentProps } from "react";

// Downloads, hash links, external destinations and the standalone API docs
// retain browser navigation. Portfolio pages use the Next.js router.
export default function SiteLink(props: ComponentProps<"a">) {
  const { href, ...rest } = props;
  const internal =
    href?.startsWith("/") &&
    !href.startsWith("//") &&
    !href.startsWith("/docs") &&
    !/\.[a-z0-9]+(?:[?#]|$)/i.test(href) &&
    !props.download &&
    !props.target;
  if (!internal) return <a {...props} />;
  return <Link {...rest} href={href!} transitionTypes={["page-navigation"]} />;
}
