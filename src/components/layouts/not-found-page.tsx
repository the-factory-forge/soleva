import { CtaLink } from "@/components/ui/cta-button";
import { cn } from "@/lib/utils";

export interface NotFoundPageProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  errorCode?: string;
  className?: string;
}

export function NotFoundPage({
  title = "Page not found",
  description = "The page you are looking for does not exist or has been moved.",
  ctaLabel = "Back to home",
  ctaHref = "/",
  errorCode = "404",
  className,
}: NotFoundPageProps) {
  return (
    <main
      className={cn(
        "flex min-h-[60vh] flex-col items-center justify-center px-5 py-20 text-center",
        className,
      )}
    >
      <span className="text-8xl font-bold text-primary/20">{errorCode}</span>
      <h1 className="mt-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">{description}</p>
      <div className="mt-8">
        <CtaLink href={ctaHref} size="lg">
          {ctaLabel}
        </CtaLink>
      </div>
    </main>
  );
}
