"use client"

import { useEffect, useRef } from "react"

const stops = [
  { name: "Lausanne", lat: 46.5197, lon: 6.6323 },
  { name: "Genève", lat: 46.2044, lon: 6.1432 },
  { name: "Sion", lat: 46.2331, lon: 7.3606 },
  { name: "Lugano", lat: 46.0037, lon: 8.9511 },
  { name: "Davos", lat: 46.8027, lon: 9.8370 },
  { name: "Zürich", lat: 47.3769, lon: 8.5417 },
  { name: "Basel", lat: 47.5596, lon: 7.5886 },
  { name: "Bern", lat: 46.9480, lon: 7.4474 },
]

export function TourMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current || !containerRef.current) return
    initialized.current = true

    const loadLeaflet = async () => {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      // Fix default marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      const map = L.map(containerRef.current!).setView([46.8, 8.2], 8)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map)

      // Add pins
      stops.forEach((s) => {
        L.marker([s.lat, s.lon]).addTo(map).bindPopup(s.name)
      })

      // Add polyline connecting stops in order
      L.polyline(
        stops.map((s) => [s.lat, s.lon] as [number, number]),
        { color: "#ff803e", weight: 3, opacity: 0.7, dashArray: "8 4" }
      ).addTo(map)
    }

    loadLeaflet()
  }, [])

  return (
    <div
      ref={containerRef}
      className="h-[450px] w-full rounded-3xl border border-border"
    />
  )
}
