"use client"

import { cn } from "@/lib/utils"

export interface ManageCookiesButtonProps {
  label: string
  manageEvent?: string
  className?: string
}

export function ManageCookiesButton({
  label,
  manageEvent = "manage-cookies",
  className,
}: ManageCookiesButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(manageEvent))}
      className={cn(
        "text-sm text-muted-foreground transition-colors hover:text-primary",
        className,
      )}
    >
      {label}
    </button>
  )
}
