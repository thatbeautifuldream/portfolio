import View from "../../../views/uses/index";
import { renderPage } from "../../../lib/page";
import { pageMetadata } from "../../../lib/metadata";
export function generateMetadata() {
  return pageMetadata("/uses/", "hi");
}
export default function Page() {
  return renderPage(View, "/uses/", "hi");
}
