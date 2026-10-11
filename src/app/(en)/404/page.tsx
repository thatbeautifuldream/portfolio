import View from "../../../views/404";
import { renderPage } from "../../../lib/page";
import { pageMetadata } from "../../../lib/metadata";
export function generateMetadata() {
  return pageMetadata("/404/", "en");
}
export default function Page() {
  return renderPage(View, "/404/", "en");
}
