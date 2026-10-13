import View from "../../../../views/project/slug";
import { contentEntry, contentParams, renderPage } from "../../../../lib/page";
import { pageMetadata } from "../../../../lib/metadata";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return contentParams("project");
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return pageMetadata(`/project/${slug}`, "en");
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = await contentEntry("project", slug, "en");
  return renderPage(View, `/project/${slug}`, "en", { project: entry });
}
