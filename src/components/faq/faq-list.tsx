"use client"

import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { Locale } from "@/lib/i18n/config"
import { faqs, type FaqCategory } from "@/lib/data/faqs"

const categoryOrder: FaqCategory[] = ["project", "van", "technology", "support", "privacy"]

export function FaqList({
  locale,
  categoryLabels,
}: {
  locale: Locale
  categoryLabels: Record<FaqCategory, string>
}) {
  const categories = categoryOrder.filter((cat) => faqs.some((f) => f.category === cat))
  const [active, setActive] = useState<FaqCategory>(categories[0])

  const visible = faqs.filter((f) => f.category === active)

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="FAQ categories">
        {categories.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={active === cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === cat
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground/70 hover:border-primary hover:text-primary"
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      <Accordion className="mt-8 flex flex-col gap-3">
        {visible.map((faq, i) => (
          <AccordionItem
            key={`${active}-${i}`}
            value={`${active}-${i}`}
            className="rounded-2xl border border-border bg-card px-5"
          >
            <AccordionTrigger className="text-left font-semibold hover:no-underline">
              {faq.question[locale]}
            </AccordionTrigger>
            <AccordionContent className="leading-relaxed text-muted-foreground">
              {faq.answer[locale]}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
