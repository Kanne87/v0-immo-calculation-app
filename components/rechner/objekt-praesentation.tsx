"use client"

import { useEffect, useCallback, useState, useRef } from "react"
import { X, ChevronDown, ChevronUp, Play, Maximize2, Minimize2 } from "lucide-react"
import type { ProjektDefinition } from "@/lib/projects-data"

interface Props {
  projekt: ProjektDefinition
  onClose: () => void
}

export function ObjektPraesentation({ projekt, onClose }: Props) {
  const [openSektionen, setOpenSektionen] = useState<Set<number>>(new Set())
  const [showVideo, setShowVideo] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const displayName = projekt.haus ? `${projekt.name} \u2013 ${projekt.haus}` : projekt.name

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose() },
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

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", handler)
    return () => document.removeEventListener("fullscreenchange", handler)
  }, [])

  const toggleSektion = (i: number) => {
    setOpenSektionen((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div
        ref={containerRef}
        className="relative w-full max-w-3xl z-10 flex flex-col rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-[#0f0f0f]"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-mono text-white/60 tracking-wider uppercase">
              {displayName}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
              title={isFullscreen ? "Vollbild beenden" : "Vollbild"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">
          {/* Hero: Bild oder Placeholder */}
          <div className="relative w-full bg-black" style={{ aspectRatio: "16/7" }}>
            {projekt.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={projekt.coverImageUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div className="text-white/10 text-[10px] font-mono tracking-[4px] uppercase">Bild</div>
                <div className="text-white/5 text-[9px] font-mono">coverImageUrl in projects-data.ts eintragen</div>
              </div>
            )}
            {/* Video-Overlay-Button */}
            {projekt.videoUrl && (
              <button
                onClick={() => setShowVideo(true)}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono bg-black/70 text-white/80 border border-white/20 hover:bg-black/90 hover:text-white transition-all backdrop-blur-sm"
              >
                <Play className="w-3 h-3 fill-current" />
                Video abspielen
              </button>
            )}
            {/* Gradient for keyfacts readability */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Key Facts Bar */}
          {projekt.keyfacts && projekt.keyfacts.length > 0 && (
            <div className="grid border-b border-white/10"
              style={{ gridTemplateColumns: `repeat(${projekt.keyfacts.length}, 1fr)` }}
            >
              {projekt.keyfacts.map((fact, i) => (
                <div
                  key={i}
                  className={`px-3 py-3 flex flex-col items-center justify-center text-center ${
                    i < projekt.keyfacts!.length - 1 ? "border-r border-white/10" : ""
                  }`}
                >
                  <div className="text-base font-serif text-white font-semibold leading-tight">
                    {fact.value}
                  </div>
                  <div className="text-[9px] font-mono text-white/40 mt-0.5 uppercase tracking-wider">
                    {fact.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Accordion Sektionen */}
          {projekt.praesektionen && projekt.praesektionen.length > 0 && (
            <div className="divide-y divide-white/10">
              {projekt.praesektionen.map((sektion, i) => {
                const isOpen = openSektionen.has(i)
                return (
                  <div key={i}>
                    <button
                      onClick={() => toggleSektion(i)}
                      className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors"
                    >
                      <span className="text-[11px] font-mono text-white/70 uppercase tracking-[2px]">
                        {sektion.title}
                      </span>
                      {isOpen
                        ? <ChevronUp className="w-3.5 h-3.5 text-white/30" />
                        : <ChevronDown className="w-3.5 h-3.5 text-white/30" />
                      }
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4">
                        <table className="w-full border-collapse">
                          <tbody>
                            {sektion.rows.map((row, j) => (
                              <tr key={j} className="border-t border-white/8 hover:bg-white/3 transition-colors">
                                <td className="py-2 pr-5 text-[10px] font-mono text-white/40 align-top w-[160px] whitespace-nowrap">
                                  {row.label}
                                </td>
                                <td className="py-2 text-[11px] font-mono text-white/80 align-top leading-relaxed">
                                  {row.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <div className="px-5 py-3 border-t border-white/10">
            <span className="text-[9px] font-mono text-white/20">
              ESC zum Schlie\u00dfen
            </span>
          </div>
        </div>
      </div>

      {/* Video Modal (layered on top) */}
      {showVideo && projekt.videoUrl && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowVideo(false)} />
          <div className="relative w-full max-w-4xl z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-white/60 tracking-wider uppercase">{displayName}</span>
              <button
                onClick={() => setShowVideo(false)}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
              <video
                ref={videoRef}
                src={projekt.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full aspect-video"
                controlsList="nodownload"
              >
                Dein Browser unterst\u00fctzt keine Videowiedergabe.
              </video>
            </div>
            <div className="mt-2 text-center">
              <span className="text-[10px] font-mono text-white/30">ESC zum Schlie\u00dfen</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
