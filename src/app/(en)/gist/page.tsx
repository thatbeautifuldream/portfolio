import View from "../../../views/gist/index";
import { renderPage } from "../../../lib/page";
import { pageMetadata } from "../../../lib/metadata";
export function generateMetadata() {
  return pageMetadata("/gist/", "en");
}
export default function Page() {
  return renderPage(View, "/gist/", "en");
}
