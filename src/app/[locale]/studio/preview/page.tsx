import { notFound } from "next/navigation";

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
  if (process.env.NODE_ENV !== "development") notFound();
  const { locale } = await params;
  const { sample } = await searchParams;
  if (
    !["about", "footer", "tooltip", "tooltip-meta", "code"].includes(
      sample ?? "",
    )
  )
    notFound();
  const { default: PreviewSamples } =
    await import("../../../../views/studio/preview-samples");
  return (
    <PreviewSamples sample={sample!} locale={locale === "hi" ? "hi" : "en"} />
  );
}
