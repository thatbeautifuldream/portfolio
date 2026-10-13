import type { ComponentProps } from "../lib/ui";
export default async function View(props: ComponentProps) {
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
