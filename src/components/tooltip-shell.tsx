import type { ComponentProps } from "react";

export default function TooltipShell({
  className,
  children,
  ...rest
}: ComponentProps<"div">) {
  return (
    <div
      className={["tip-root relative", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
      <div
        className="tip pointer-events-none absolute top-0 left-0 z-10 max-w-[min(100%,20rem)] rounded-md bg-foreground px-2 py-1 text-sm text-balance text-background shadow-sm"
        aria-hidden="true"
        data-show="false"
      >
        <span className="tip-inner flex max-w-full flex-wrap items-baseline gap-1">
          <span className="tip-label font-medium tabular-nums"></span>
          <span className="tip-meta tabular-nums opacity-60"></span>
        </span>
      </div>
    </div>
  );
}
