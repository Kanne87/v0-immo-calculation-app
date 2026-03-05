import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beratungsmodus | Immo Beratungstool",
  description: "Interaktive Immobilien-Investitionsberatung",
};

export default function BeratungLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
