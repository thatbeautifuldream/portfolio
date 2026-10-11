import View from "../../../../views/gist/[slug]";
import { contentEntry, contentParams, renderPage } from "../../../../lib/page";
import { pageMetadata } from "../../../../lib/metadata";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return contentParams("gist");
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return pageMetadata(`/gist/${slug}`, "en");
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = await contentEntry("gist", slug, "en");
  return renderPage(View, `/gist/${slug}`, "en", { gist: entry });
}
