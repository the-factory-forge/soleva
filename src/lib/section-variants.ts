export type SectionVariant = "default" | "muted" | "accent" | "primary" | "secondary";

export const sectionVariantClasses: Record<
  SectionVariant,
  {
    section: string;
    heading: string;
    body: string;
    eyebrow: string;
    card: string;
    cardBorder: string;
    iconBadge: string;
    iconColor: string;
  }
> = {
  default: {
    section: "bg-background",
    heading: "text-foreground",
    body: "text-muted-foreground",
    eyebrow: "text-secondary",
    card: "bg-background",
    cardBorder: "border-border",
    iconBadge: "bg-primary/10",
    iconColor: "text-secondary",
  },
  muted: {
    section: "bg-muted/50",
    heading: "text-foreground",
    body: "text-muted-foreground",
    eyebrow: "text-secondary",
    card: "bg-background",
    cardBorder: "border-border",
    iconBadge: "bg-primary/10",
    iconColor: "text-secondary",
  },
  accent: {
    section: "bg-accent",
    heading: "text-accent-foreground",
    body: "text-accent-foreground/70",
    eyebrow: "text-secondary",
    card: "bg-background",
    cardBorder: "border-border",
    iconBadge: "bg-primary/10",
    iconColor: "text-secondary",
  },
  primary: {
    section: "bg-primary",
    heading: "text-primary-foreground",
    body: "text-primary-foreground/80",
    eyebrow: "text-primary-foreground/90",
    card: "bg-primary-foreground/10",
    cardBorder: "border-primary-foreground/20",
    iconBadge: "bg-primary-foreground/20",
    iconColor: "text-primary-foreground",
  },
  secondary: {
    section: "bg-secondary",
    heading: "text-secondary-foreground",
    body: "text-secondary-foreground/80",
    eyebrow: "text-secondary-foreground/90",
    card: "bg-secondary-foreground/10",
    cardBorder: "border-secondary-foreground/20",
    iconBadge: "bg-secondary-foreground/20",
    iconColor: "text-secondary-foreground",
  },
};
