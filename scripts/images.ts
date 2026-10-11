import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";

export interface ResponsiveImage {
  src: string;
  width: number;
  height: number;
  sizes: string;
  blurDataURL?: string;
}
// Markdown images need dimensions and tiny previews; Next owns responsive optimization.
export async function optimizeContentImages(files: string[]) {
  const manifest: Record<string, ResponsiveImage> = {};
  for (const file of files) {
    if (!/\.(png|jpe?g|webp|avif)$/i.test(file)) continue;
    const { width, height, pages } = await sharp(file).metadata();
    if (!width || !height) continue;
    // A tiny, aspect-matched preview is inlined; no extra request or runtime work.
    const blurDataURL =
      !pages || pages === 1
        ? `data:image/webp;base64,${(
            await sharp(file)
              .resize({
                width: 10,
                height: 10,
                fit: "inside",
                withoutEnlargement: true,
              })
              .webp({ quality: 30 })
              .toBuffer()
          ).toString("base64")}`
        : undefined;
    manifest[`/content-assets/${path.basename(file)}`] = {
      src: `/content-assets/${path.basename(file)}`,
      width,
      height,
      sizes: `(min-width: ${width}px) ${width}px, 100vw`,
      blurDataURL,
    };
  }
  await fs.mkdir(".generated", { recursive: true });
  await fs.writeFile(".generated/images.json", JSON.stringify(manifest));
  return manifest;
}
