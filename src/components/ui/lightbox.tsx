"use client"

import { useState, useCallback, useEffect } from "react"
import { Image } from "@/components/ui/image"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type LightboxProps = {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  className?: string
  children?: React.ReactNode
}

export function Lightbox({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  className,
  children,
}: LightboxProps) {
  const [open, setOpen] = useState(false)
  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, closeModal])

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={cn(
          "group/lightbox relative block w-full cursor-zoom-in overflow-hidden border-0 bg-transparent p-0",
          className,
        )}
        aria-label={alt ? `Agrandir : ${alt}` : "Agrandir l'image"}
      >
        {children ?? (
          <Image
            src={src}
            alt={alt}
            fill={fill}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            sizes={sizes}
            className="object-cover transition-transform duration-500 group-hover/lightbox:scale-105"
          />
        )}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover/lightbox:bg-black/10">
          <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-opacity group-hover/lightbox:opacity-100">
            Cliquer pour agrandir
          </span>
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <button
            type="button"
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
