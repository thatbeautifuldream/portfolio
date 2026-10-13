import type { ComponentProps } from "../lib/ui";
import { classes } from "../lib/ui";
import ClientEnhancement from "./client-enhancement";

export default async function View(props: ComponentProps) {
  const { className } = props;
  return (
    <>
      <div className={classes(["tip-root relative", className])}>
        {props.children}
        <div
          className="tip pointer-events-none absolute top-0 left-0 overflow-hidden rounded-md bg-foreground px-2 py-1 text-sm whitespace-nowrap text-background"
          aria-hidden="true"
          data-show="false"
        >
          <span className="tip-inner flex w-max items-baseline gap-1">
            <span className="tip-label font-medium tabular-nums"></span>
            <span className="tip-meta tabular-nums opacity-60"></span>
          </span>
        </div>
      </div>

      <ClientEnhancement kind="tooltip" />
    </>
  );
}
