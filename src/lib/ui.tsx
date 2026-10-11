import type { ReactNode, CSSProperties } from "react";
import { readFileSync } from "node:fs";
import type { ResponsiveImage } from "../../scripts/images";
import NextImage from "next/image";
const responsiveImages: Record<string, ResponsiveImage> = JSON.parse(
  readFileSync(".generated/images.json", "utf8"),
);
const imagesByOptimizedSrc = new Map(
  Object.values(responsiveImages).map((image) => [image.src, image]),
);
import icons from "@iconify-json/ri/icons.json";
import type { Locale } from "../i18n";
export interface SiteContext {
  locale: Locale;
  url: URL;
  site: URL;
}
export type ComponentProps = {
  context: SiteContext;
  children?: ReactNode;
  [key: string]: any;
};
export function classes(values: any[]): string {
  return values
    .flatMap((value) =>
      typeof value === "object" && value
        ? Object.keys(value).filter((key) => value[key])
        : value
          ? [value]
          : [],
    )
    .join(" ");
}
export function Icon({
  name,
  className,
  ...props
}: {
  name: string;
  className?: string;
  [key: string]: any;
}) {
  const data = icons.icons[name.replace("ri:", "") as keyof typeof icons.icons];
  if (!data) throw new Error(`Unknown icon: ${name}`);
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      className={className}
      aria-hidden={props.role ? undefined : true}
      {...props}
      dangerouslySetInnerHTML={{ __html: data.body }}
    />
  );
}
export function Image({
  src,
  width,
  height,
  srcSet,
  sizes,
  ...props
}: {
  src:
    | string
    | { src: string; width: number; height: number; blurDataURL?: string };
  width?: number;
  height?: number;
  [key: string]: any;
}) {
  const image = typeof src === "string" ? { src, width, height } : src;
  const optimized =
    responsiveImages[image.src] ?? imagesByOptimizedSrc.get(image.src);
  const renderedWidth = width ?? image.width ?? optimized?.width;
  const renderedHeight =
    height ??
    (width && image.width && image.height
      ? Math.round((width * image.height) / image.width)
      : (image.height ?? optimized?.height));
  const blurDataURL =
    optimized?.blurDataURL ??
    ("blurDataURL" in image ? image.blurDataURL : undefined);
  const imageProps = {
    src: optimized?.src ?? image.src,
    width: renderedWidth,
    height: renderedHeight,
    alt: "",
    loading: "lazy" as const,
    decoding: "async" as const,
    ...props,
  };
  const responsiveSrcSet = srcSet ?? optimized?.srcSet;
  const responsiveSizes = sizes ?? optimized?.sizes;
  if (!blurDataURL) {
    return (
      <img {...imageProps} srcSet={responsiveSrcSet} sizes={responsiveSizes} />
    );
  }
  const nativeImage = (
    <NextImage
      {...imageProps}
      width={renderedWidth!}
      height={renderedHeight!}
      // Responsive variants can round their height by a pixel. Keep the
      // authored ratio through decoding so revealing the image cannot reflow it.
      style={{
        aspectRatio: `${renderedWidth} / ${renderedHeight}`,
        ...props.style,
      }}
      unoptimized
      placeholder="blur"
      blurDataURL={blurDataURL}
    />
  );
  // Keep our build-time WebP srcsets for static export. Next owns loading and
  // placeholder removal; picture selects the same responsive files as before.
  return responsiveSrcSet ? (
    <picture style={{ display: "contents" }}>
      <source srcSet={responsiveSrcSet} sizes={responsiveSizes} />
      {nativeImage}
    </picture>
  ) : (
    nativeImage
  );
}
