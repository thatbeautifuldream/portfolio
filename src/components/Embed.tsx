import type { ComponentProps } from "../lib/ui";
import { classes } from "../lib/ui";
interface Props {
  src: string;
  title: string;
  caption: string;
}
export default async function View(props: ComponentProps) {
  const context = props.context;
  const { src, title, caption } = props;
  return (
    <>
      <figure data-wide>
        <iframe
          src={src}
          title={title}
          loading="lazy"
          className="border-rule block h-[32rem] w-full rounded-lg border"
        ></iframe>
        <figcaption>{caption}</figcaption>
      </figure>
    </>
  );
}
