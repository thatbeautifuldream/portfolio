import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import DocumentLayout from "../../layouts/document-layout";
import { isLocale } from "../../i18n";
import { documentMetadata, documentViewport } from "../../lib/metadata";

export const metadata = documentMetadata;

export const viewport = documentViewport;

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <DocumentLayout locale={locale}>{children}</DocumentLayout>;
}
