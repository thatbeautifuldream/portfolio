import { generateOpenGraphImage } from "../lib/og-renderer";
import { ogImageOptions } from "../lib/og";
import { siteConfig } from "../lib/seo";

// Site-wide default OG card, used by any page that doesn't set its own image.
export async function GET() {
  const png = await generateOpenGraphImage(
    ogImageOptions({ title: siteConfig.name, description: siteConfig.tagline }),
  );
  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
}
