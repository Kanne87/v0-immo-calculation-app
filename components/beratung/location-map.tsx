"use client";

import { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import type { BeratungProjectData } from "@/lib/beratung/project-data";
import "leaflet/dist/leaflet.css";

type LocationTab = "macro" | "meso" | "micro";

// CartoDB Voyager: heller, moderner Kartenstil mit guter Lesbarkeit
const TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

const ZOOM_LEVELS: Record<LocationTab, number> = {
  macro: 6,
  meso: 12,
  micro: 15,
};

const CENTER_POSITIONS: Record<LocationTab, (project: BeratungProjectData) => [number, number]> = {
  macro: () => [51.5, 10.5],
  meso: () => [52.535, 13.2],
  micro: (project) => [project.coordinates.lat, project.coordinates.lng],
};

function createIcon(color: string, size: number = 24) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="width:${size}px;height:${size}px;background:${color};border:2px solid rgba(255,255,255,0.9);border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5,
      easeLinearity: 0.25,
    });
  }, [map, center, zoom]);

  return null;
}

const POI_COLORS: Record<string, string> = {
  "OePNV": "#2563eb",
  "Einkauf": "#16a34a",
  "Gastronomie": "#d97706",
  "Oeffentlich": "#7c3aed",
  "Auto & Service": "#dc2626",
  "Fitness & Freizeit": "#0891b2",
};

function getPOIOffset(index: number, total: number): [number, number] {
  const angle = (2 * Math.PI * index) / total;
  const radius = 0.003 + Math.random() * 0.003;
  return [Math.cos(angle) * radius, Math.sin(angle) * radius];
}

export function LocationMap({ project, activeTab }: { project: BeratungProjectData; activeTab: LocationTab }) {
  const poiMarkersRef = useRef<{ lat: number; lng: number; label: string; color: string }[]>([]);

  const center = useMemo(() => CENTER_POSITIONS[activeTab](project), [activeTab, project]);
  const zoom = ZOOM_LEVELS[activeTab];

  const poiMarkers = useMemo(() => {
    if (activeTab !== "micro") return [];

    const markers: { lat: number; lng: number; label: string; color: string }[] = [];
    let globalIndex = 0;
    const totalPois = project.location.micro.pois.reduce((sum, cat) => sum + cat.items.length, 0);

    project.location.micro.pois.forEach((cat) => {
      const color = POI_COLORS[cat.category] || "#6b7280";
      cat.items.forEach((item) => {
        const [latOff, lngOff] = getPOIOffset(globalIndex, totalPois);
        markers.push({
          lat: project.coordinates.lat + latOff,
          lng: project.coordinates.lng + lngOff,
          label: item,
          color,
        });
        globalIndex++;
      });
    });

    poiMarkersRef.current = markers;
    return markers;
  }, [activeTab, project]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full"
      zoomControl={false}
      attributionControl={false}
      style={{ background: "#f0f0f0" }}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      <MapUpdater center={center} zoom={zoom} />

      {activeTab === "macro" && (
        <Circle
          center={[52.52, 13.405]}
          radius={25000}
          pathOptions={{ color: "#2563eb", fillColor: "#2563eb", fillOpacity: 0.08, weight: 2, dashArray: "6 4" }}
        />
      )}

      {activeTab === "meso" && (
        <Circle
          center={[52.535, 13.2]}
          radius={4000}
          pathOptions={{ color: "#0d9488", fillColor: "#0d9488", fillOpacity: 0.08, weight: 2, dashArray: "6 4" }}
        />
      )}

      {activeTab === "micro" && (
        <>
          <Marker
            position={[project.coordinates.lat, project.coordinates.lng]}
            icon={createIcon("#16a34a", 28)}
          >
            <Popup>
              <div className="text-sm">
                <strong>{project.name}</strong>
                <br />
                {project.address}
              </div>
            </Popup>
          </Marker>

          {poiMarkers.map((poi, i) => (
            <Marker key={i} position={[poi.lat, poi.lng]} icon={createIcon(poi.color, 16)}>
              <Popup>
                <div className="text-xs">{poi.label}</div>
              </Popup>
            </Marker>
          ))}
        </>
      )}
    </MapContainer>
  );
}
