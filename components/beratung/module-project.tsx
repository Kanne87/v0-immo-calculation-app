"use client";

import { useEffect, useState } from "react";
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
