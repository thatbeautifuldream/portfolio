import View from "../../../views/privacy";
import { renderPage } from "../../../lib/page";
import { pageMetadata } from "../../../lib/metadata";
export function generateMetadata() {
  return pageMetadata("/privacy/", "en");
}
export default function Page() {
  return renderPage(View, "/privacy/", "en");
}
