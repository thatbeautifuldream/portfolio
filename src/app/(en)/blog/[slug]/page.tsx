import View from "../../../../views/blog/[slug]";
import { contentEntry, contentParams, renderPage } from "../../../../lib/page";
import { pageMetadata } from "../../../../lib/metadata";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return contentParams("blog");
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return pageMetadata(`/blog/${slug}`, "en");
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = await contentEntry("blog", slug, "en");
  return renderPage(View, `/blog/${slug}`, "en", { post: entry });
}
