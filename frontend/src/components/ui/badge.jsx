/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--text-primary)] text-[var(--accent-contrast)]",
        secondary: "border-[var(--border-soft)] bg-[var(--bg-alt)] text-[var(--text-primary)]",
        destructive: "border-transparent bg-red-500 text-white",
        outline: "text-[var(--text-primary)]",
        success: "border-transparent bg-emerald-500 text-white",
        warning: "border-transparent bg-[var(--accent)] text-[var(--accent-contrast)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
