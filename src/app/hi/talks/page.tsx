import View from "../../../views/talks";
import { renderPage } from "../../../lib/page";
import { pageMetadata } from "../../../lib/metadata";
export function generateMetadata() {
  return pageMetadata("/talks/", "hi");
}
export default function Page() {
  return renderPage(View, "/talks/", "hi");
}
