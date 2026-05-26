import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  MapPin, Navigation, Wallet, Search, Car, Compass,
  ArrowRight, Star, Crown, Phone, MessageCircle, Clock, Shield, Sparkles,
  ChevronRight, X, Check,
} from "lucide-react";

export const Route = createFileRoute("/vtc")({
  head: () => ({
    meta: [
      { title: "Matt Ride — VTC à Dakar" },
      { name: "description", content: "Commandez une course VTC à Dakar. Suivi temps réel, paiement Wave / Orange Money, service Premium 24/7." },
    ],
    links: [
      { rel: "stylesheet", href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" },
    ],
  }),
  component: VtcPage,
});

type Service = "courses" | "premium";
type Phase = "idle" | "search" | "matched" | "arriving" | "onroute" | "done";

const RECENTS = [
  { name: "Terminus 77 Cité Taco", zone: "Sangalkam, Région de Dakar", eta: "35 min" },
  { name: "Cité Tacko", zone: "Rufisque Est, Région de Dakar", eta: "26 min" },
  { name: "Mbao", zone: "Thiaroye, Région de Dakar", eta: "5 min" },
  { name: "AIBD Aéroport Blaise Diagne", zone: "Diass, Région de Thiès", eta: "55 min" },
];

const CATEGORIES: { id: Service; title: string; sub?: string; icon: typeof Car; tint: string }[] = [
  { id: "courses", title: "Courses", sub: "à partir de 4 min", icon: Car, tint: "bg-primary/10 text-primary" },
  { id: "premium", title: "Premium", sub: "Service VIP 24/7", icon: Crown, tint: "bg-gold/15 text-gold-foreground" },
];

function VtcPage() {
  const [service, setService] = useState<Service>("courses");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0); // 0–100 driver position toward destination
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [durationMin, setDurationMin] = useState<number | null>(null);
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [dropCoords, setDropCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [driverCoords, setDriverCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<string[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropSuggestions, setShowDropSuggestions] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Charger les favoris depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem("vtc-favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Sauvegarder les favoris dans localStorage
  useEffect(() => {
    localStorage.setItem("vtc-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (address: string) => {
    if (!favorites.includes(address) && address) {
      setFavorites([...favorites, address]);
      toast.success("Adresse ajoutée aux favoris");
    }
  };

  const removeFromFavorites = (address: string) => {
    setFavorites(favorites.filter((f) => f !== address));
    toast.success("Adresse retirée des favoris");
  };

  // Prix de base FCFA/km
  const PRICE_PER_KM = service === "premium" ? 350 : 200;
  const BASE_FARE = service === "premium" ? 1000 : 500;

  // Géocodage avec Nominatim OSM pour le Sénégal
  const geocodeAddress = async (query: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", Sénégal")}&limit=1&countrycodes=sn`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch (error) {
      console.error("Erreur de géocodage:", error);
    }
    return null;
  };

  // Suggestions d'adresses avec Nominatim
  const fetchSuggestions = async (query: string, setSuggestions: (s: string[]) => void) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", Sénégal")}&limit=5&countrycodes=sn&addressdetails=1`
      );
      const data = await response.json();
      const suggestions = data.map((item: any) => item.display_name);
      setSuggestions(suggestions);
    } catch (error) {
      console.error("Erreur de suggestions:", error);
    }
  };

  // Géolocalisation de l'utilisateur
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setPickupCoords({ lat: latitude, lng: longitude });
          
          // Reverse geocoding pour obtenir l'adresse
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            setPickup(data.display_name || "Ma position");
          } catch (error) {
            setPickup("Ma position");
          }
        },
        (error) => {
          toast.error("Impossible d'obtenir votre position");
          console.error(error);
        }
      );
    } else {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur");
    }
  };

  // Calcul du prix estimé avec géocodage réel
  const calculatePrice = async () => {
    if (!pickup || !drop) return;

    // Géocodage des adresses
    const pickupLocation = pickupCoords || await geocodeAddress(pickup);
    const dropLocation = dropCoords || await geocodeAddress(drop);

    if (pickupLocation && dropLocation) {
      setPickupCoords(pickupLocation);
      setDropCoords(dropLocation);

      // Calcul de distance réelle avec la formule Haversine
      const R = 6371; // Rayon de la Terre en km
      const dLat = (dropLocation.lat - pickupLocation.lat) * Math.PI / 180;
      const dLon = (dropLocation.lng - pickupLocation.lng) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(pickupLocation.lat * Math.PI / 180) * Math.cos(dropLocation.lat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      setDistanceKm(Math.round(distance * 10) / 10);
      setDurationMin(Math.round(distance * 3 + 5)); // ~3 min/km + 5 min
      setEstimatedPrice(Math.round(BASE_FARE + distance * PRICE_PER_KM));
    }
  };

  useEffect(() => {
    if (pickup && drop && phase === "idle") {
      calculatePrice();
    }
  }, [pickup, drop, service, pickupCoords, dropCoords]);

  // Suggestions pour le départ
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (pickup && phase === "idle") {
        fetchSuggestions(pickup, setPickupSuggestions);
        setShowPickupSuggestions(true);
      }
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [pickup, phase]);

  // Suggestions pour la destination
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (drop && phase === "idle") {
        fetchSuggestions(drop, setDropSuggestions);
        setShowDropSuggestions(true);
      }
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [drop, phase]);

  // Simulated flow
  useEffect(() => {
    if (phase === "search") {
      const t = setTimeout(() => setPhase("matched"), 2200);
      return () => clearTimeout(t);
    }
    if (phase === "arriving") {
      const t = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { clearInterval(t); setPhase("onroute"); setProgress(0); return 0; }
          return p + 5;
        });
      }, 350);
      return () => clearInterval(t);
    }
    if (phase === "onroute") {
      const t = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { clearInterval(t); setPhase("done"); return 100; }
          return p + 3;
        });
      }, 400);
      return () => clearInterval(t);
    }
  }, [phase]);

  const book = () => {
    if (!pickup || !drop) { toast.error("Renseignez le départ et la destination"); return; }
    setPhase("search");
    // Simuler la position initiale du chauffeur
    if (pickupCoords) {
      setDriverCoords({
        lat: pickupCoords.lat + 0.01,
        lng: pickupCoords.lng + 0.01,
      });
    }
  };

  return (
    <SiteLayout>
      <section className="bg-secondary/30 py-8 lg:py-14">
        <div className="mx-auto max-w-6xl px-4 grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Phone-like card on the left, like Yango */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1 text-xs">
                <MapPin className="h-3.5 w-3.5 text-success" /> Votre position · Dakar, Plateau
              </div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold mt-3">
                Bonjour 👋 <span className="text-primary">où allons-nous ?</span>
              </h1>
            </div>

            {/* Service grid 2x2 */}
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setService(c.id)}
                  className={`relative rounded-2xl p-5 border text-left transition-all ${service === c.id ? "border-gold shadow-elegant bg-card" : "border-border bg-card hover:border-gold/40"}`}>
                  <div className={`h-14 w-14 rounded-2xl grid place-items-center ${c.tint}`}>
                    <c.icon className="h-7 w-7" />
                  </div>
                  <div className="mt-3 font-semibold">{c.title}</div>
                  {c.sub && <div className="text-xs text-muted-foreground mt-0.5">· {c.sub}</div>}
                  {c.id === "premium" && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold text-gold-foreground">VIP</span>
                  )}
                </button>
              ))}
            </div>

            {/* Search bar */}
            <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
              <div className="relative">
                <div className="flex items-center gap-3 bg-secondary/60 rounded-xl px-4 py-3">
                  <Car className="h-5 w-5 text-primary" />
                  <input
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    onFocus={() => setShowPickupSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
                    placeholder="Lieu de départ"
                    className="flex-1 bg-transparent text-sm focus:outline-none"
                  />
                </div>
                {showPickupSuggestions && pickupSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                    {pickupSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => { setPickup(suggestion); setShowPickupSuggestions(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-secondary/50 text-sm truncate"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative mt-2">
                <div className="flex items-center gap-3 bg-secondary/60 rounded-xl px-4 py-3">
                  <Navigation className="h-5 w-5 text-gold" />
                  <input
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    onFocus={() => setShowDropSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowDropSuggestions(false), 200)}
                    placeholder="Où allons-nous ?"
                    className="flex-1 bg-transparent text-sm focus:outline-none"
                  />
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                {showDropSuggestions && dropSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                    {dropSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => { setDrop(suggestion); setShowDropSuggestions(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-secondary/50 text-sm truncate"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={getCurrentLocation}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 rounded-xl px-3 py-2 text-sm transition-colors"
                >
                  <Navigation className="h-4 w-4 text-primary" /> Ma position
                </button>
              </div>
              
              {estimatedPrice && (
                <div className="mt-3 bg-gold/10 border border-gold/30 rounded-xl p-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Estimation : </span>
                      <span className="font-bold text-gold-foreground">{estimatedPrice.toLocaleString()} FCFA</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {distanceKm} km · {durationMin} min
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {drop && !favorites.includes(drop) && (
                      <button
                        onClick={() => addToFavorites(drop)}
                        className="flex-1 flex items-center justify-center gap-1 text-xs bg-gold/20 hover:bg-gold/30 rounded-lg py-1.5 transition-colors"
                      >
                        <Star className="h-3 w-3" /> Ajouter aux favoris
                      </button>
                    )}
                  </div>
                </div>
              )}
              <Button variant="hero" size="lg" className="w-full mt-3" onClick={book}>
                <Search className="h-4 w-4" /> Commander {service === "premium" ? "Premium" : ""}
              </Button>
            </div>

            {/* Recents */}
            <div className="space-y-1">
              {RECENTS.map((r) => (
                <button key={r.name} onClick={() => setDrop(r.name)}
                  className="w-full flex items-center gap-3 py-3 px-2 hover:bg-secondary/40 rounded-xl text-left transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-secondary grid place-items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{r.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{r.zone}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{r.eta}</div>
                </button>
              ))}
            </div>

            {/* Favorites */}
            {favorites.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Favoris</div>
                <div className="space-y-1">
                  {favorites.map((fav, index) => (
                    <div key={index} className="flex items-center gap-2 group">
                      <button
                        onClick={() => setDrop(fav)}
                        className="flex-1 flex items-center gap-3 py-2 px-2 hover:bg-secondary/40 rounded-xl text-left transition-colors"
                      >
                        <div className="h-8 w-8 rounded-lg bg-gold/10 grid place-items-center">
                          <Star className="h-3.5 w-3.5 text-gold-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{fav}</div>
                        </div>
                      </button>
                      <button
                        onClick={() => removeFromFavorites(fav)}
                        className="h-8 w-8 grid place-items-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Premium banner */}
            <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-primary-glow text-primary-foreground p-6 relative">
              <div className="absolute inset-0 grid-pattern opacity-30" />
              <div className="relative flex items-center gap-5">
                <Crown className="h-12 w-12 text-gold" />
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider opacity-80">Nouveau</div>
                  <div className="font-display text-xl font-bold mt-1">Matt Ride Premium</div>
                  <p className="text-sm opacity-80 mt-1">Chauffeur dédié, Mercedes Classe E, accueil aéroport, 24/7.</p>
                </div>
                <Button variant="glass" size="sm" onClick={() => setService("premium")}>Découvrir</Button>
              </div>
            </div>
          </div>

          {/* Right: Live map / status panel */}
          <div className="lg:sticky lg:top-24 h-fit">
            <RidePanel
              phase={phase}
              progress={progress}
              pickup={pickup}
              drop={drop}
              service={service}
              onCancel={() => { setPhase("idle"); setProgress(0); setDriverCoords(null); }}
              onConfirm={() => setPhase("arriving")}
              onFinish={() => { setPhase("idle"); setProgress(0); setPickup(""); setDrop(""); setPickupCoords(null); setDropCoords(null); setDriverCoords(null); setEstimatedPrice(null); }}
              pickupCoords={pickupCoords}
              dropCoords={dropCoords}
              driverCoords={driverCoords}
            />
          </div>
        </div>
      </section>

      {/* Conducteur partenaire */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Shield, t: "Chauffeurs vérifiés", d: "Permis, casier, formation premium." },
            { icon: Sparkles, t: "Suivi temps réel", d: "Position GPS, itinéraire vivant, ETA précis." },
            { icon: Star, t: "Notation après chaque course", d: "Qualité de service garantie." },
          ].map((f) => (
            <div key={f.t} className="bg-card border border-border rounded-2xl p-6">
              <div className="h-10 w-10 rounded-xl bg-primary/8 grid place-items-center">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="font-semibold mt-3">{f.t}</div>
              <p className="text-sm text-muted-foreground mt-1">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

/* ────────────────────────────── Ride status panel ────────────────────────────── */
function RidePanel({
  phase, progress, pickup, drop, service, onCancel, onConfirm, onFinish,
  pickupCoords, dropCoords, driverCoords,
}: {
  phase: Phase; progress: number; pickup: string; drop: string; service: Service;
  onCancel: () => void; onConfirm: () => void; onFinish: () => void;
  pickupCoords: { lat: number; lng: number } | null;
  dropCoords: { lat: number; lng: number } | null;
  driverCoords: { lat: number; lng: number } | null;
}) {
  const driver = {
    name: "Mamadou Diop", rating: 4.9, trips: 1287,
    car: service === "premium" ? "Mercedes Classe E · Noir" : "Toyota Corolla · Blanc",
    plate: service === "premium" ? "DK 1212 VIP" : "DK 4587 AB",
    eta: service === "premium" ? "2 min" : "4 min",
  };

  // Initialisation de Leaflet côté client
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initMap = async () => {
      const L = await import("leaflet");
      
      // Nettoyer la carte existante
      const existingMap = (window as any).vtcMapInstance;
      if (existingMap) {
        existingMap.remove();
      }

      const mapContainer = document.getElementById("vtc-map");
      if (!mapContainer) return;

      const map = L.map("vtc-map").setView([14.7167, -17.4677], 13);
      
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      (window as any).vtcMapInstance = map;

      // Ajouter les marqueurs si les coordonnées sont disponibles
      if (pickupCoords) {
        L.marker([pickupCoords.lat, pickupCoords.lng], {
          icon: L.divIcon({
            className: "custom-marker",
            html: `<div style="background: #22c55e; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          }),
        }).addTo(map);
      }

      if (dropCoords) {
        L.marker([dropCoords.lat, dropCoords.lng], {
          icon: L.divIcon({
            className: "custom-marker",
            html: `<div style="background: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          }),
        }).addTo(map);
      }

      if (driverCoords) {
        L.marker([driverCoords.lat, driverCoords.lng], {
          icon: L.divIcon({
            className: "custom-marker",
            html: `<div style="background: #f97316; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
            </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          }),
        }).addTo(map);
      }

      // Ajuster la vue si des marqueurs sont présents
      if (pickupCoords && dropCoords) {
        const bounds = L.latLngBounds([pickupCoords.lat, pickupCoords.lng], [dropCoords.lat, dropCoords.lng]);
        map.fitBounds(bounds, { padding: [50, 50] });
      } else if (pickupCoords) {
        map.setView([pickupCoords.lat, pickupCoords.lng], 14);
      } else if (dropCoords) {
        map.setView([dropCoords.lat, dropCoords.lng], 14);
      }

      // Ajouter un bouton de contrôle pour recentrer
      const centerControl = L.control({ position: "topright" });
      centerControl.onAdd = function () {
        const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");
        const button = L.DomUtil.create("button", "", div);
        button.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`;
        button.style.cssText = "background: white; border: none; padding: 8px; cursor: pointer; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);";
        button.title = "Recentrer la carte";
        button.onclick = () => {
          if (pickupCoords && dropCoords) {
            const bounds = L.latLngBounds([pickupCoords.lat, pickupCoords.lng], [dropCoords.lat, dropCoords.lng]);
            map.fitBounds(bounds, { padding: [50, 50] });
          } else if (pickupCoords) {
            map.setView([pickupCoords.lat, pickupCoords.lng], 14);
          } else if (dropCoords) {
            map.setView([dropCoords.lat, dropCoords.lng], 14);
          } else {
            map.setView([14.7167, -17.4677], 13);
          }
        };
        return div;
      };
      centerControl.addTo(map);
    };

    initMap();

    return () => {
      const existingMap = (window as any).vtcMapInstance;
      if (existingMap) {
        existingMap.remove();
      }
    };
  }, [pickupCoords, dropCoords, driverCoords]);

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-elegant">
      {/* Leaflet Map */}
      <div className="relative h-56 bg-secondary/30 overflow-hidden">
        <div id="vtc-map" className="h-full w-full" />
        {/* status badge */}
        {phase !== "idle" && phase !== "search" && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-white z-[1000]">
            {phase === "matched"
              ? "CHAUFFEUR TROUVÉ"
              : phase === "onroute"
              ? "EN COURSE"
              : phase === "arriving"
              ? "CHAUFFEUR EN ROUTE"
              : "COURSE TERMINÉE"}
          </div>
        )}
      </div>

      <div className="p-5">
        {phase === "idle" && (
          <div className="text-center py-6">
            <Compass className="h-10 w-10 text-muted-foreground mx-auto" />
            <h3 className="font-display font-bold mt-3">Prêt à partir ?</h3>
            <p className="text-sm text-muted-foreground mt-1">Renseignez votre destination pour voir les chauffeurs disponibles à proximité.</p>
          </div>
        )}

        {phase === "search" && (
          <div className="text-center py-8 space-y-3">
            <div className="mx-auto h-14 w-14 rounded-full border-4 border-gold/30 border-t-gold animate-spin" />
            <h3 className="font-display font-bold">Recherche d'un chauffeur…</h3>
            <p className="text-sm text-muted-foreground">{pickup || "Votre position"} → {drop}</p>
            <button onClick={onCancel} className="text-xs text-muted-foreground hover:text-foreground underline">Annuler</button>
          </div>
        )}

        {(phase === "matched" || phase === "arriving" || phase === "onroute") && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gold to-primary grid place-items-center text-white font-bold">MD</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{driver.name}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-gold text-gold" /> {driver.rating} · {driver.trips} courses
                </div>
              </div>
              <button className="h-9 w-9 rounded-xl bg-success/10 text-success grid place-items-center"><Phone className="h-4 w-4" /></button>
              <button className="h-9 w-9 rounded-xl bg-primary/8 text-primary grid place-items-center"><MessageCircle className="h-4 w-4" /></button>
            </div>
            <div className="bg-secondary/50 rounded-xl p-3 text-sm flex justify-between">
              <div><div className="text-xs text-muted-foreground">Véhicule</div><div className="font-medium">{driver.car}</div></div>
              <div className="text-right"><div className="text-xs text-muted-foreground">Plaque</div><div className="font-mono font-bold">{driver.plate}</div></div>
            </div>

            {phase === "matched" && (
              <div className="space-y-2">
                <div className="text-sm">
                  Arrivée estimée : <strong className="text-foreground">{driver.eta}</strong>
                </div>
                <Button variant="hero" className="w-full" onClick={onConfirm}>Confirmer la course</Button>
                <button onClick={onCancel} className="w-full text-xs text-muted-foreground hover:text-foreground py-1">Annuler</button>
              </div>
            )}

            {(phase === "arriving" || phase === "onroute") && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{phase === "arriving" ? "Chauffeur en route" : "En direction de l'arrivée"}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gold to-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="text-xs text-muted-foreground">
                  {phase === "arriving" ? `Il arrive dans ${Math.max(1, Math.ceil((100 - progress) / 20))} min` : `Arrivée dans ${Math.max(1, Math.ceil((100 - progress) / 12))} min`}
                </div>
              </div>
            )}
          </div>
        )}

        {phase === "done" && <RatingPanel onFinish={onFinish} driver={driver.name} />}
      </div>
    </div>
  );
}

function RatingPanel({ onFinish, driver }: { onFinish: () => void; driver: string }) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const submit = () => {
    if (stars === 0) { toast.error("Notez votre course"); return; }
    toast.success(`Merci ! Note ${stars}★ enregistrée pour ${driver}`);
    onFinish();
  };
  return (
    <div className="space-y-4 text-center py-2">
      <div className="mx-auto h-14 w-14 rounded-full bg-success/10 grid place-items-center">
        <Check className="h-7 w-7 text-success" />
      </div>
      <h3 className="font-display font-bold">Course terminée</h3>
      <p className="text-sm text-muted-foreground">Comment s'est passée votre course avec {driver} ?</p>
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setStars(n)}>
            <Star className={`h-9 w-9 transition-all ${n <= stars ? "fill-gold text-gold scale-110" : "text-border"}`} />
          </button>
        ))}
      </div>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Un mot pour votre chauffeur ?"
        className="w-full min-h-[70px] rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:border-gold" />
      <div className="flex gap-2">
        <Button variant="ghost" className="flex-1" onClick={onFinish}><X className="h-4 w-4" /> Passer</Button>
        <Button variant="hero" className="flex-1" onClick={submit}>Envoyer <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
