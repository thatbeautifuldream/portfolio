import { notFound } from "next/navigation";
import { isLocale } from "../../../../i18n";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Component preview",
  robots: { index: false, follow: false },
};

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sample?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { sample } = await searchParams;
  if (!["about", "footer", "code"].includes(sample ?? "")) notFound();
  const { default: PreviewSamples } =
    await import("../../../../views/canvas/preview-samples");
  return <PreviewSamples sample={sample!} locale={locale} />;
}
