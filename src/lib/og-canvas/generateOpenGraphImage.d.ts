import type { OGImageOptions } from "./types";
export declare function generateOpenGraphImage({
  cacheDir,
  title,
  description,
  dir,
  bgGradient,
  bgImage,
  border: borderConfig,
  padding,
  logo,
  font: fontConfig,
  fonts,
  format,
  quality,
}: OGImageOptions): Promise<BodyInit>;
