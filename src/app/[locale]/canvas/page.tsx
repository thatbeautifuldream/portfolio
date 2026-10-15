import { notFound } from "next/navigation";
import { isLocale } from "../../../i18n";
import { canvasMetadata } from "../../../lib/metadata";
import { buildCanvasSchema } from "../../../lib/seo";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return canvasMetadata(locale);
}

export default async function CanvasPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { default: Samples } = await import("../../../views/canvas/samples");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildCanvasSchema(locale)).replaceAll(
            "<",
            "\\u003c",
          ),
        }}
      />
      <Samples locale={locale} />
    </>
  );
}
