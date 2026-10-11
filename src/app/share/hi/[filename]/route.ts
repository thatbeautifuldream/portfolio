import { createStoryImage } from "../../../../lib/og";
import { getStoryPages } from "../../../../lib/og-data";
export const dynamic = "force-static";
export const dynamicParams = false;
export async function generateStaticParams() {
  return Object.keys(await getStoryPages("hi")).map((filename) => ({
    filename,
  }));
}
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const page = (await getStoryPages("hi"))[(await params).filename];
  if (!page) return new Response(null, { status: 404 });
  return createStoryImage(page);
}
