"use client"

import { useState, useRef } from "react"
import { Share2, Check } from "lucide-react"

export function ShareButton({ label }: { label: string }) {
  const [copied, setCopied] = useState(false)
  const sharing = useRef(false)

  const handleShare = async () => {
    if (sharing.current) return
    sharing.current = true

    const url = window.location.origin
    const text = "Découvrez Soleva - le van électrique solaire suisse"

    try {
      if (navigator.share) {
        await navigator.share({ title: "Soleva", text, url })
      } else {
        await navigator.clipboard.writeText(`${text} : ${url}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // user cancelled or error - ignore
    } finally {
      sharing.current = false
    }
  }

  return (
    <button
      onClick={handleShare}
      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Lien copié
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          {label}
        </>
      )}
    </button>
  )
}
