import View from "../../../views/work";
import { renderPage } from "../../../lib/page";
import { pageMetadata } from "../../../lib/metadata";
export function generateMetadata() {
  return pageMetadata("/work/", "hi");
}
export default function Page() {
  return renderPage(View, "/work/", "hi");
}
