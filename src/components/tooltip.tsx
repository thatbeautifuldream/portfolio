import type { ComponentProps } from "../lib/ui";
import ClientEnhancement from "./client-enhancement";
import TooltipShell from "./tooltip-shell";

export default async function View(props: ComponentProps) {
  const { className } = props;
  return (
    <>
      <TooltipShell className={className}>{props.children}</TooltipShell>
      <ClientEnhancement kind="tooltip" />
    </>
  );
}
