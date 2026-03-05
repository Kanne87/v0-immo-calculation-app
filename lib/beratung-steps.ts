import {
  AlertTriangle,
  Lightbulb,
  Star,
  MapPin,
  Building2,
  Calculator,
  Rocket,
  type LucideIcon,
} from "lucide-react";

export interface StepConfig {
  number: number;
  title: string;
  shortTitle: string;
  icon: LucideIcon;
  color: string;
}

export const STEPS: StepConfig[] = [
  { number: 1, title: "Problemerkennung", shortTitle: "Problem", icon: AlertTriangle, color: "text-red-400" },
  { number: 2, title: "Loesungsframework", shortTitle: "Loesung", icon: Lightbulb, color: "text-yellow-400" },
  { number: 3, title: "BIG FIVE Score", shortTitle: "Score", icon: Star, color: "text-amber-400" },
  { number: 4, title: "LocationExplorer", shortTitle: "Lage", icon: MapPin, color: "text-blue-400" },
  { number: 5, title: "Projekt & Bautraeger", shortTitle: "Projekt", icon: Building2, color: "text-teal-400" },
  { number: 6, title: "Musterberechnung", shortTitle: "Rechner", icon: Calculator, color: "text-emerald-400" },
  { number: 7, title: "Call to Action", shortTitle: "Aktion", icon: Rocket, color: "text-cyan-400" },
];
