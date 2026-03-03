"use client"

import { useEffect, useRef, useCallback } from "react"
import { X, Maximize2, Minimize2 } from "lucide-react"
import { useState } from "react"

interface VideoPlayerProps {
  url: string
  title: string
  onClose: () => void
}

export function VideoPlayer({ url, title, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [handleKeyDown])

  const toggleFullscreen = () => {
    const container = overlayRef.current?.querySelector(".video-container") as HTMLElement
    if (!container) return
    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", handler)
    return () => document.removeEventListener("fullscreenchange", handler)
  }, [])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="video-container relative w-full max-w-4xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-white/70 tracking-wider uppercase">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
              title={isFullscreen ? "Vollbild beenden" : "Vollbild"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video */}
        <div className="relative rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
          <video
            ref={videoRef}
            src={url}
            controls
            autoPlay
            playsInline
            className="w-full aspect-video"
            controlsList="nodownload"
          >
            Dein Browser unterstützt keine Videowiedergabe.
          </video>
        </div>

        {/* Hint */}
        <div className="mt-2 text-center">
          <span className="text-[10px] font-mono text-white/30">
            ESC zum Schließen
          </span>
        </div>
      </div>
    </div>
  )
}
