import { isLocale } from "../../../../i18n";
import { createOGImage } from "../../../../lib/og";
import { studioCopy } from "../../../../lib/seo";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response(null, { status: 404 });
  return createOGImage(studioCopy[locale]);
}
