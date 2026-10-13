import type { ComponentProps } from "../lib/ui";
import ClientEnhancement from "./client-enhancement";

export default async function View(_props: ComponentProps) {
  return (
    <>
      <ClientEnhancement kind="code-copy" />
    </>
  );
}
