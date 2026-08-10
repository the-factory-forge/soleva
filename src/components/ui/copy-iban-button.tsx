"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function CopyIbanButton({ iban }: { iban: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(iban.replace(/\s/g, ""))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Copié
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copier l'IBAN
        </>
      )}
    </button>
  )
}
