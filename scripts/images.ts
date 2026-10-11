import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";

export interface ResponsiveImage {
  src: string;
  width: number;
  height: number;
  srcSet: string;
  sizes: string;
  blurDataURL?: string;
}
// Static image optimization retains responsive images without a runtime server.
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
    const widths = [
      ...new Set(
        [640, 750, 828, 1080, 1280, 1600, 1920, width].filter(
          (w) => w <= width,
        ),
      ),
    ].sort((a, b) => a - b);
    const stem = path.basename(file).replace(/\.[^.]+$/, "");
    const variants = await Promise.all(
      widths.map(async (w) => {
        const name = `${stem}-${w}.webp`;
        await sharp(file)
          .resize({ width: w })
          .webp({ quality: 80 })
          .toFile(path.join("public/content-assets", name));
        return { src: `/content-assets/${name}`, width: w };
      }),
    );
    manifest[`/content-assets/${path.basename(file)}`] = {
      src: variants.at(-1)!.src,
      width,
      height,
      srcSet: variants.map((v) => `${v.src} ${v.width}w`).join(", "),
      sizes: `(min-width: ${width}px) ${width}px, 100vw`,
      blurDataURL,
    };
  }
  await fs.mkdir(".generated", { recursive: true });
  await fs.writeFile(".generated/images.json", JSON.stringify(manifest));
  return manifest;
}
