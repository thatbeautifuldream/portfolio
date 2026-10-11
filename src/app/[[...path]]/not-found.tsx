import { ViewTransition } from "react";
import Missing from "../../views/404";
import { siteConfig } from "../../lib/seo";
export default function NotFound() {
  return (
    <ViewTransition
      name="page-content"
      default="none"
      share="page-navigation"
      enter="page-navigation"
      exit="page-navigation"
    >
      <div className="min-h-svh">
        <Missing
          context={{
            locale: "en",
            url: new URL("/404/", siteConfig.url),
            site: new URL(siteConfig.url),
          }}
        />
      </div>
    </ViewTransition>
  );
}
