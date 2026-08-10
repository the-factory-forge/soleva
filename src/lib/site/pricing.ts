// Soleva sponsor tiers (from v0 sponsor-tiers.ts - labels in dicts).
// Labels come from i18n dictionaries

export interface PricingItem {
  nameKey: string;
  descriptionKey?: string;
  duration?: string;
  price: string;
}

export const pricingItems: PricingItem[] = [
  {
    nameKey: "pricing.items.0.name",
    descriptionKey: "pricing.items.0.description",
    price: "CHF 500",
  },
  {
    nameKey: "pricing.items.1.name",
    descriptionKey: "pricing.items.1.description",
    price: "CHF 1500",
  },
  {
    nameKey: "pricing.items.2.name",
    descriptionKey: "pricing.items.2.description",
    price: "CHF 5000+",
  },
];
