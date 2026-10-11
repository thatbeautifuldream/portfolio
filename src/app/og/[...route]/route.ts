import { createOGImage } from "../../../lib/og";
import { getOGPages } from "../../../lib/og-data";
export const dynamic = "force-static";
export const dynamicParams = false;
export async function generateStaticParams() {
  return Object.keys(await getOGPages()).map((id) => ({
    route: id.split("/"),
  }));
}
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ route: string[] }> },
) {
  const page = (await getOGPages())[(await params).route.join("/")];
  if (!page) return new Response(null, { status: 404 });
  return createOGImage(page);
}
