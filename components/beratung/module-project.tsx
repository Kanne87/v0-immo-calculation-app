"use client";

import { useEffect, useState, useRef } from "react";
import type { BeratungProjectData } from "@/lib/beratung/project-data";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Home,
  Ruler,
  DollarSign,
  Calendar,
  CheckCircle,
  Building2,
  Briefcase,
  Users,
  Zap,
  Play,
  Pause,
  Maximize2,
} from "lucide-react";

export function ModuleProject({ project }: { project: BeratungProjectData }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-5xl">
        <h1
          className={`mb-4 text-center text-4xl font-bold tracking-tight text-foreground transition-all duration-700 md:text-5xl lg:text-6xl ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {project.name}
        </h1>
        <p
          className={`mx-auto mb-12 max-w-lg text-center text-lg text-muted-foreground transition-all delay-200 duration-700 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          Projekt & Bautraeger im Detail
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          <div
            className={`rounded-2xl border border-border/50 bg-card p-8 transition-all duration-700 ${
              mounted ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
            }`}
          >
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-foreground">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-400/10">
                <Building2 className="size-5 text-blue-400" />
              </div>
              Projektsteckbrief
            </h2>

            <div className="space-y-4">
              <InfoRow icon={MapPin} label="Adresse" value={project.address} />
              <InfoRow icon={Home} label="Wohneinheiten" value={`${project.units} WE`} />
              <InfoRow
                icon={Ruler}
                label="Wohnungsgroessen"
                value={`${project.unitSizes.min} \u2013 ${project.unitSizes.max} m\u00B2 (Durchschn. ${project.unitSizes.avg} m\u00B2)`}
              />
              <InfoRow
                icon={DollarSign}
                label="Kaufpreis ab"
                value={`${project.priceFrom.toLocaleString("de-DE")} EUR`}
              />
              <InfoRow icon={DollarSign} label="Miete" value={`${project.rentPerSqm} EUR/m\u00B2`} />
              <InfoRow icon={Zap} label="KfW-Standard" value={project.kfwStandard} />
              <InfoRow icon={Calendar} label="Baubeginn" value={project.constructionStart} />
              <InfoRow icon={CheckCircle} label="Fertigstellung" value={project.completion} />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="secondary">Neubau</Badge>
              <Badge variant="secondary">{project.kfwStandard}</Badge>
              <Badge variant="secondary">Aufzug</Badge>
              <Badge variant="secondary">Balkon/Terrasse</Badge>
              <Badge variant="secondary">Barrierefrei</Badge>
            </div>
          </div>

          <div
            className={`rounded-2xl border border-border/50 bg-card p-8 transition-all delay-200 duration-700 ${
              mounted ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
            }`}
          >
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-foreground">
              <div className="flex size-10 items-center justify-center rounded-xl bg-teal-400/10">
                <Briefcase className="size-5 text-teal-400" />
              </div>
              Bautraeger
            </h2>

            <div className="space-y-4">
              <InfoRow icon={Building2} label="Name" value={project.developer.name} />
              <InfoRow icon={Briefcase} label="Rechtsform" value={project.developer.legalForm} />
              <InfoRow icon={Users} label="Vertriebskoordination" value={project.developer.salesCoordination} />
            </div>

            <div className="mt-8 rounded-xl bg-secondary/30 p-6">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Highlights
              </h3>
              <ul className="space-y-3">
                {[
                  "MAXAR AG als erfahrener Projektentwickler",
                  "DS Konzept als professionelle Vertriebskoordination",
                  "KfW EH40 QNG Plus Neubau mit TUeV-Baucontrolling",
                  "264 Wohneinheiten in nachhaltiger Massivbauweise",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                    <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {project.videoUrl && (
          <VideoPlayer
            src={project.videoUrl}
            title={project.name}
            mounted={mounted}
          />
        )}
      </div>
    </div>
  );
}

function VideoPlayer({ src, title, mounted }: { src: string; title: string; mounted: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowOverlay(false);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowOverlay(true);
    }
  };

  const handleFullscreen = () => {
    videoRef.current?.requestFullscreen?.();
  };

  return (
    <div
      className={`mt-8 transition-all duration-700 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: "400ms" }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-black">
        <video
          ref={videoRef}
          src={src}
          className="w-full aspect-video"
          playsInline
          preload="metadata"
          controls={isPlaying}
          onClick={togglePlay}
          onEnded={() => { setIsPlaying(false); setShowOverlay(true); }}
        />
        {showOverlay && (
          <div
            className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity"
            onClick={togglePlay}
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm transition-transform hover:scale-110">
              <Play className="ml-1 size-7 text-white" fill="white" />
            </div>
            <p className="mt-4 text-sm font-medium text-white/80">
              Projektvideo {title}
            </p>
          </div>
        )}
        {!showOverlay && (
          <button
            onClick={(e) => { e.stopPropagation(); handleFullscreen(); }}
            className="absolute right-3 top-3 rounded-lg bg-black/40 p-2 text-white/70 backdrop-blur-sm transition-colors hover:text-white"
          >
            <Maximize2 className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
