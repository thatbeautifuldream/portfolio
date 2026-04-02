import * as React from "react"

import { cn } from "@/lib/utils"

export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical"
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "shrink-0 bg-border/80",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  )
}
