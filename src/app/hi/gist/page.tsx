import View from "../../../views/gist/index";
import { renderPage } from "../../../lib/page";
import { pageMetadata } from "../../../lib/metadata";
export function generateMetadata() {
  return pageMetadata("/gist/", "hi");
}
export default function Page() {
  return renderPage(View, "/gist/", "hi");
}
