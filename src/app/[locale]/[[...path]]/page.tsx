import { notFound } from "next/navigation";
import { pageMetadata } from "../../../lib/metadata";
import { contentEntry, renderPage } from "../../../lib/page";
import {
  localizedPageParams,
  resolvePageRoute,
  type LocalizedPageParams,
} from "../../../lib/page-routes";

type Props = { params: Promise<LocalizedPageParams> };

export const dynamicParams = false;

export const generateStaticParams = localizedPageParams;

export async function generateMetadata({ params }: Props) {
  const route = resolvePageRoute(await params);
  if (!route) notFound();
  return pageMetadata(route.path, route.locale);
}

export default async function Page({ params }: Props) {
  const route = resolvePageRoute(await params);
  if (!route) notFound();
  const { default: View } = await route.load();
  const props =
    route.kind === "content"
      ? {
          [route.prop]: await contentEntry(
            route.section,
            route.slug,
            route.locale,
          ),
        }
      : {};
  return renderPage(View, route.path, route.locale, props);
}
