import View from "../../../../views/uses/[slug]";
import { contentEntry, contentParams, renderPage } from "../../../../lib/page";
import { pageMetadata } from "../../../../lib/metadata";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return contentParams("uses");
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return pageMetadata(`/uses/${slug}`, "hi");
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = await contentEntry("uses", slug, "hi");
  return renderPage(View, `/uses/${slug}`, "hi", { item: entry });
}
