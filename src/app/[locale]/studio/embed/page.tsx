import { notFound } from "next/navigation";
import { isLocale } from "../../../../i18n";
import { studioMetadata } from "../../../../lib/metadata";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return studioMetadata(locale, true);
}

export default async function EmbedPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { default: Samples } = await import("../../../../views/studio/samples");
  return <Samples locale={locale} embedded />;
}
