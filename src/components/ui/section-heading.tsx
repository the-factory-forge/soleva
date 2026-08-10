import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  inverted = false,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: "center" | "left"
  className?: string
  inverted?: boolean
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-sm font-semibold uppercase tracking-[0.18em]",
            inverted ? "text-secondary" : "text-primary",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "text-pretty font-heading text-3xl font-extrabold leading-tight sm:text-4xl md:text-[2.75rem]",
          inverted ? "text-dark-foreground" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            inverted ? "text-dark-foreground/70" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
