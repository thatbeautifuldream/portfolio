import View from "../../../views/project/index";
import { renderPage } from "../../../lib/page";
import { pageMetadata } from "../../../lib/metadata";
export function generateMetadata() {
  return pageMetadata("/project/", "hi");
}
export default function Page() {
  return renderPage(View, "/project/", "hi");
}
