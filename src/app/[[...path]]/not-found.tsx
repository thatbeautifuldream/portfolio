import Missing from "../../views/404";
import { siteConfig } from "../../lib/seo";
export default function NotFound() {
  return (
    <Missing
      context={{
        locale: "en",
        url: new URL("/404/", siteConfig.url),
        site: new URL(siteConfig.url),
      }}
    />
  );
}
