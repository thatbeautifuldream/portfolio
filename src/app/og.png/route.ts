import { createOGImage } from "../../lib/og";
import { siteConfig } from "../../lib/seo";
export const dynamic = "force-static";
export async function GET() {
  return createOGImage({
    title: siteConfig.name,
    description: siteConfig.tagline,
  });
}
