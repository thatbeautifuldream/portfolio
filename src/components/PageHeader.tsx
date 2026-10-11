import type { ComponentProps } from "../lib/ui";
import { classes } from "../lib/ui";
interface Props {
  title: string;
  meta?: string;
}
export default async function View(props: ComponentProps) {
  const context = props.context;
  const { title, meta } = props;
  return (
    <>
      <header className="grid gap-1">
        <h1 className="font-medium text-pretty">{title}</h1>
        {meta && <p className="text-faint">{meta}</p>}
        {props.children}
      </header>
    </>
  );
}
