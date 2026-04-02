import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col", className)} {...props} />
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid gap-2 p-6", className)} {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("text-foreground", className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("text-muted-foreground", className)} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle }
