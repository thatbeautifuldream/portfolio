import { notFound } from "next/navigation";
import { isLocale } from "../../../i18n";
import { studioMetadata } from "../../../lib/metadata";
import { buildStudioSchema } from "../../../lib/seo";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return studioMetadata(locale);
}

export default async function StudioPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { default: Samples } = await import("../../../views/studio/samples");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildStudioSchema(locale)).replaceAll(
            "<",
            "\\u003c",
          ),
        }}
      />
      <Samples locale={locale} />
    </>
  );
}
