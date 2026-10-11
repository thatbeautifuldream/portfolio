import View from "../../../views/contact";
import { renderPage } from "../../../lib/page";
import { pageMetadata } from "../../../lib/metadata";
export function generateMetadata() {
  return pageMetadata("/contact/", "en");
}
export default function Page() {
  return renderPage(View, "/contact/", "en");
}
