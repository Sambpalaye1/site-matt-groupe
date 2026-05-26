import { useEffect, useRef } from "react";

// Note: Leaflet doit être installé avec: npm install leaflet @types/leaflet
// Import dynamique pour éviter les erreurs SSR
let L: any = null;

if (typeof window !== "undefined") {
  L = require("leaflet");
  L.Icon.Default.imagePath = "https://unpkg.com/leaflet@1.9.4/dist/images/";
}

interface MapLeafletProps {
  pickup?: { lat: number; lng: number } | null;
  drop?: { lat: number; lng: number } | null;
  driverLocation?: { lat: number; lng: number } | null;
  className?: string;
}

export default function MapLeaflet({ pickup, drop, driverLocation, className = "" }: MapLeafletProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!L || !mapContainerRef.current) return;

    // Initialiser la carte centrée sur Dakar
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([14.7167, -17.4677], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);
    }

    // Nettoyer les marqueurs existants
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Ajouter le marqueur de départ
    if (pickup) {
      const pickupIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background: #22c55e; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      const marker = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon }).addTo(mapRef.current);
      markersRef.current.push(marker);
    }

    // Ajouter le marqueur d'arrivée
    if (drop) {
      const dropIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      const marker = L.marker([drop.lat, drop.lng], { icon: dropIcon }).addTo(mapRef.current);
      markersRef.current.push(marker);
    }

    // Ajouter le marqueur du chauffeur
    if (driverLocation) {
      const driverIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background: #f97316; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
        </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
      const marker = L.marker([driverLocation.lat, driverLocation.lng], { icon: driverIcon }).addTo(mapRef.current);
      markersRef.current.push(marker);
    }

    // Ajuster la vue pour inclure tous les marqueurs
    if (pickup && drop) {
      const bounds = L.latLngBounds([pickup.lat, pickup.lng], [drop.lat, drop.lng]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (pickup) {
      mapRef.current.setView([pickup.lat, pickup.lng], 14);
    } else if (drop) {
      mapRef.current.setView([drop.lat, drop.lng], 14);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [pickup, drop, driverLocation]);

  return <div ref={mapContainerRef} className={className} style={{ height: "100%", width: "100%", minHeight: "300px" }} />;
}
