import View from "../../../views/blog/index";
import { renderPage } from "../../../lib/page";
import { pageMetadata } from "../../../lib/metadata";
export function generateMetadata() {
  return pageMetadata("/blog/", "hi");
}
export default function Page() {
  return renderPage(View, "/blog/", "hi");
}
