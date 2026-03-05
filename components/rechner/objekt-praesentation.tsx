"use client"

import { useEffect, useCallback, useState, useRef } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { ProjektDefinition } from "@/lib/projects-data"

interface Props {
  projekt: ProjektDefinition
  onClose: () => void
}

type SlideType = "image" | "faktenblatt" | "video"

const SLIDE_LABELS: Record<SlideType, string> = {
  image: "Objekt",
  faktenblatt: "Eckdaten",
  video: "Video",
}

export function ObjektPraesentation({ projekt, onClose }: Props) {
  const slides: SlideType[] = [
    ...(projekt.coverImageUrl ? ["image" as const] : []),
    ...(projekt.faktenblatt?.length ? ["faktenblatt" as const] : []),
    ...(projekt.videoUrl ? ["video" as const] : []),
  ]

  const [current, setCurrent] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const displayName = projekt.haus ? `${projekt.name} – ${projekt.haus}` : projekt.name

  const prev = () => setCurrent((c) => Math.max(0, c - 1))
  const next = () => setCurrent((c) => Math.min(slides.length - 1, c + 1))

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClose]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [handleKeyDown])

  if (slides.length === 0) return null

  const slideType = slides[current]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl z-10 flex flex-col" style={{ maxHeight: "90vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-white/70 tracking-wider uppercase">
              {displayName}
            </span>
            <span className="text-[10px] font-mono text-white/40 bg-white/10 px-1.5 py-0.5 rounded">
              {SLIDE_LABELS[slideType]}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slide content */}
        <div className="relative rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10 flex-1">
          {slideType === "image" && projekt.coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={projekt.coverImageUrl}
              alt={displayName}
              className="w-full h-full object-cover"
              style={{ maxHeight: "70vh" }}
            />
          )}

          {slideType === "faktenblatt" && projekt.faktenblatt && (
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "70vh" }}
            >
              <div className="px-5 py-4">
                <div className="text-[9px] font-mono text-white/40 tracking-[3px] uppercase mb-3">
                  Liegenschaft | {projekt.adresse}
                </div>
                <table className="w-full border-collapse">
                  <tbody>
                    {projekt.faktenblatt.map((row, i) => (
                      <tr
                        key={i}
                        className="border-t border-white/10 group hover:bg-white/5 transition-colors"
                      >
                        <td className="py-2.5 pr-4 text-[11px] font-mono text-white/50 align-top whitespace-nowrap w-[180px]">
                          {row.label}
                        </td>
                        <td className="py-2.5 text-[11px] font-mono text-white/85 align-top leading-relaxed">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {slideType === "video" && projekt.videoUrl && (
            <video
              ref={videoRef}
              src={projekt.videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full aspect-video"
              controlsList="nodownload"
              style={{ maxHeight: "70vh" }}
            >
              Dein Browser unterstützt keine Videowiedergabe.
            </video>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={current === 0}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots + labels */}
          <div className="flex items-center gap-3">
            {slides.map((slide, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="flex flex-col items-center gap-1 group"
              >
                <div
                  className={`h-1 rounded-full transition-all ${
                    i === current
                      ? "w-6 bg-primary"
                      : "w-2 bg-white/25 hover:bg-white/50"
                  }`}
                />
                <span
                  className={`text-[9px] font-mono transition-colors ${
                    i === current ? "text-primary" : "text-white/30 group-hover:text-white/60"
                  }`}
                >
                  {SLIDE_LABELS[slide]}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={next}
            disabled={current === slides.length - 1}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-1 text-center">
          <span className="text-[10px] font-mono text-white/25">
            {current + 1} / {slides.length} · ESC zum Schließen · ← → Navigation
          </span>
        </div>
      </div>
    </div>
  )
}
