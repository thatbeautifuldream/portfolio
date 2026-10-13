import DocumentLayout from "../layouts/document-layout";
import Missing from "../views/404";
import { renderPage } from "../lib/page";
import {
  documentMetadata,
  documentViewport,
  pageMetadata,
} from "../lib/metadata";
export const viewport = documentViewport;
export async function generateMetadata() {
  return { ...documentMetadata, ...(await pageMetadata("/404/", "en")) };
}
export default function GlobalNotFound() {
  return (
    <DocumentLayout locale="en">
      {renderPage(Missing, "/404/", "en")}
    </DocumentLayout>
  );
}
