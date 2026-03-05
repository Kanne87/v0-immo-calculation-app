"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { BeratungProjectData } from "@/lib/beratung/project-data";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Building2,
  MapPin,
  Users,
  TrendingUp,
  GraduationCap,
  Percent,
  DollarSign,
  Train,
  Car,
  AlertTriangle,
  ShoppingBag,
  Landmark,
  Trees,
  Factory,
  Ruler,
  Home,
} from "lucide-react";

const LocationMap = dynamic(() => import("./location-map").then((m) => m.LocationMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <div className="size-8 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
    </div>
  ),
});

type LocationTab = "macro" | "meso" | "micro";

const TAB_CONFIG: { key: LocationTab; label: string; icon: typeof Globe; color: string; bgColor: string }[] = [
  { key: "macro", label: "Makrolage", icon: Globe, color: "text-blue-400", bgColor: "bg-blue-400/10" },
  { key: "meso", label: "Mesolage", icon: Building2, color: "text-teal-400", bgColor: "bg-teal-400/10" },
  { key: "micro", label: "Mikrolage", icon: MapPin, color: "text-emerald-400", bgColor: "bg-emerald-400/10" },
];

const INFRA_ICONS: Record<string, typeof Factory> = {
  factory: Factory,
  "shopping-bag": ShoppingBag,
  landmark: Landmark,
  trees: Trees,
  train: Train,
};

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} Mio.`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}.000`;
  return n.toString();
}

function MacroPanel({ data }: { data: BeratungProjectData["location"]["macro"] }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-bold text-foreground">{data.city}</h3>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Users} label="Einwohner" value={formatNumber(data.population)} color="text-blue-400" />
          <StatCard icon={TrendingUp} label="BIP" value={`${data.gdp} Mrd. EUR`} color="text-blue-400" />
          <StatCard icon={Percent} label="Leerstand" value={`${data.vacancyRate} %`} color="text-blue-400" />
          <StatCard icon={DollarSign} label="Neubaumiete" value={`${data.rentNewConstruction} EUR/m\u00B2`} color="text-blue-400" />
          <StatCard icon={GraduationCap} label="Studierende" value={formatNumber(data.students)} color="text-blue-400" />
          <StatCard icon={Home} label="Spitzenrendite" value={`${data.yieldResidential} %`} color="text-blue-400" />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Top-Arbeitgeber</h4>
        <div className="flex flex-wrap gap-2">
          {data.topEmployers.map((emp) => (
            <Badge key={emp.name} variant="secondary" className="text-xs">
              {emp.name} ({emp.employees})
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Key-Fakten</h4>
        <ul className="space-y-2">
          {data.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-foreground/80">
              <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-400" />
              {h}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MesoPanel({ data }: { data: BeratungProjectData["location"]["meso"] }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-bold text-foreground">{data.district}</h3>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Users} label="Einwohner" value={formatNumber(data.populationDistrict)} color="text-teal-400" />
          <StatCard icon={Train} label="Fahrzeit Zentrum" value={`${data.transitTimeCenter.minutes} Min. (${data.transitTimeCenter.mode})`} color="text-teal-400" />
          <StatCard icon={Car} label="Autofahrt Zentrum" value={`${data.carTimeCenter.minutes} Min. (${data.carTimeCenter.distanceKm} km)`} color="text-teal-400" />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Infrastruktur</h4>
        <ul className="space-y-3">
          {data.keyInfrastructure.map((item) => {
            const Icon = INFRA_ICONS[item.icon] || Building2;
            return (
              <li key={item.text} className="flex items-start gap-3 text-sm text-foreground/80">
                <Icon className="mt-0.5 size-4 shrink-0 text-teal-400" />
                {item.text}
              </li>
            );
          })}
        </ul>
      </div>

      <blockquote className="rounded-xl border-l-2 border-teal-400/50 bg-teal-400/5 px-4 py-3 text-sm italic leading-relaxed text-muted-foreground">
        {data.quote.text}
        <footer className="mt-2 text-xs not-italic text-muted-foreground/60">&mdash; {data.quote.source}</footer>
      </blockquote>
    </div>
  );
}

function MicroPanel({ data, project }: { data: BeratungProjectData["location"]["micro"]; project: BeratungProjectData }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-bold text-foreground">{project.address}</h3>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Ruler} label="Grundstueck" value={`${formatNumber(data.plotSizeSqm)} m\u00B2`} color="text-emerald-400" />
          <StatCard icon={Home} label="Wohneinheiten" value={`${project.units}`} color="text-emerald-400" />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">POIs nach Kategorie</h4>
        <div className="space-y-4">
          {data.pois.map((cat) => (
            <div key={cat.category}>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                {cat.category}
              </p>
              <ul className="space-y-1.5">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                    <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {data.risks.length > 0 && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-400">Risiko-Hinweis</span>
          </div>
          {data.risks.map((risk) => (
            <div key={risk.type}>
              <p className="mb-1 text-sm text-foreground/80">{risk.description}</p>
              <p className="text-xs text-muted-foreground">Mitigation: {risk.mitigation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Users; label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-border/30 bg-secondary/30 p-3">
      <div className="mb-1 flex items-center gap-2">
        <Icon className={`size-3.5 ${color}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}

export function ModuleLocation({ project }: { project: BeratungProjectData }) {
  const [activeTab, setActiveTab] = useState<LocationTab>("macro");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`flex h-dvh flex-col transition-opacity duration-500 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex items-center gap-2 border-b border-border/50 px-6 py-3">
        {TAB_CONFIG.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? `${tab.bgColor} ${tab.color}`
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="relative w-[60%] border-r border-border/30">
          <LocationMap project={project} activeTab={activeTab} />
        </div>

        <div className="w-[40%] overflow-y-auto p-6">
          {activeTab === "macro" && <MacroPanel data={project.location.macro} />}
          {activeTab === "meso" && <MesoPanel data={project.location.meso} />}
          {activeTab === "micro" && <MicroPanel data={project.location.micro} project={project} />}
        </div>
      </div>
    </div>
  );
}
