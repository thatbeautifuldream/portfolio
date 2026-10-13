import { isLocale } from "../../../../i18n";
import { createOGImage } from "../../../../lib/og";
import { studioCopy } from "../../../../lib/seo";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  if (process.env.NODE_ENV !== "development")
    return new Response(null, { status: 404 });
  const { locale } = await params;
  if (!isLocale(locale)) return new Response(null, { status: 404 });
  const response = await createOGImage(studioCopy[locale]);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
