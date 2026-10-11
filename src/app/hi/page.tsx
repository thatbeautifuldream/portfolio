import View from "../../views/index";
import { renderPage } from "../../lib/page";
import { pageMetadata } from "../../lib/metadata";
export function generateMetadata() {
  return pageMetadata("/", "hi");
}
export default function Page() {
  return renderPage(View, "/", "hi");
}
