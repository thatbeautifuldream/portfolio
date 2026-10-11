import type { ReactNode, CSSProperties } from "react";
import { readFileSync } from "node:fs";
import type { ResponsiveImage } from "../../scripts/images";
const responsiveImages: Record<string, ResponsiveImage> = JSON.parse(
  readFileSync(".generated/images.json", "utf8"),
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
  ...props
}: {
  src: string | { src: string; width: number; height: number };
  width?: number;
  height?: number;
  [key: string]: any;
}) {
  const image = typeof src === "string" ? { src, width, height } : src;
  const renderedWidth = width ?? image.width;
  const renderedHeight =
    height ??
    (width && image.width && image.height
      ? Math.round((width * image.height) / image.width)
      : image.height);
  return (
    <img
      src={responsiveImages[image.src]?.src ?? image.src}
      srcSet={responsiveImages[image.src]?.srcSet}
      sizes={responsiveImages[image.src]?.sizes}
      width={renderedWidth}
      height={renderedHeight}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
}
