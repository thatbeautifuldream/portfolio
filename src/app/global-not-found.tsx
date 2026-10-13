import DocumentLayout from "../layouts/document-layout";
import Missing from "../views/404";
import { renderPage } from "../lib/page";
import { pageMetadata } from "../lib/metadata";
export function generateMetadata() {
  return pageMetadata("/404/", "en");
}
export default function GlobalNotFound() {
  return (
    <DocumentLayout locale="en">
      {renderPage(Missing, "/404/", "en")}
    </DocumentLayout>
  );
}
