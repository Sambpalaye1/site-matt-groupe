import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar, Users, Fuel, Gauge, MapPin, Clock } from "lucide-react";
import corolla from "@/assets/car-corolla.jpg";
import prado from "@/assets/car-prado.jpg";
import picanto from "@/assets/car-picanto.jpg";

export const Route = createFileRoute("/location")({
  head: () => ({
    meta: [
      { title: "Location de véhicules — Matt Group Sénégal" },
      { name: "description", content: "Louez une citadine, berline, SUV ou minibus à Dakar. Réservation flexible, livraison à domicile." },
    ],
  }),
  component: LocationPage,
});

const CARS = [
  { img: picanto, name: "Kia Picanto", cat: "Citadine", price: "18 000", seats: 4, trans: "Manuelle", fuel: "Essence" },
  { img: corolla, name: "Toyota Corolla", cat: "Berline", price: "32 000", seats: 5, trans: "Automatique", fuel: "Essence" },
  { img: prado, name: "Toyota Prado", cat: "SUV", price: "75 000", seats: 7, trans: "Automatique", fuel: "Diesel" },
  { img: corolla, name: "Hyundai Elantra", cat: "Berline", price: "35 000", seats: 5, trans: "Automatique", fuel: "Essence" },
  { img: picanto, name: "Hyundai i10", cat: "Citadine", price: "16 000", seats: 4, trans: "Manuelle", fuel: "Essence" },
  { img: prado, name: "Minibus Hiace", cat: "Minibus", price: "95 000", seats: 14, trans: "Manuelle", fuel: "Diesel" },
];

const FILTERS = ["Tous", "Citadine", "Berline", "SUV", "Minibus"];

function LocationPage() {
  const [selectedCar, setSelectedCar] = useState<typeof CARS[0] | null>(null);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [showReservationModal, setShowReservationModal] = useState(false);

  const handleReserve = (car: typeof CARS[0]) => {
    setSelectedCar(car);
    setShowReservationModal(true);
  };

  const handleConfirmReservation = () => {
    if (!pickupDate || !returnDate || !pickupLocation) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    toast.success(`Réservation confirmée pour ${selectedCar?.name}`);
    setShowReservationModal(false);
    setSelectedCar(null);
    setPickupDate("");
    setReturnDate("");
    setPickupLocation("");
  };

  return (
    <SiteLayout>
      <section className="bg-hero text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative mx-auto max-w-4xl px-4 text-center space-y-5">
          <h1 className="font-display text-4xl lg:text-5xl font-bold">Location de véhicules à Dakar</h1>
          <p className="text-primary-foreground/80 text-lg">Du citadine au SUV familial, plus de 200 véhicules contrôlés disponibles.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter bar */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-soft flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 flex-1 min-w-[180px]">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              placeholder="Date de prise en charge"
              className="bg-transparent text-sm outline-none flex-1"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 flex-1 min-w-[180px]">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              placeholder="Date de retour"
              className="bg-transparent text-sm outline-none flex-1"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 flex-1 min-w-[180px]">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <input
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="Lieu de retrait"
              className="bg-transparent text-sm outline-none flex-1"
            />
          </div>
          <Button variant="premium">Rechercher</Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((f, i) => (
            <button key={f} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-secondary"}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CARS.map((c) => (
            <div key={c.name} className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-elegant transition-all">
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                <img src={c.img} alt={c.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-lg">{c.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold/15 text-gold-foreground font-medium">{c.cat}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {c.seats} places</span>
                  <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" /> {c.trans}</span>
                  <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5" /> {c.fuel}</span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <span className="font-display text-2xl font-bold text-primary">{c.price}</span>
                    <span className="text-xs text-muted-foreground"> FCFA / jour</span>
                  </div>
                  <Button variant="hero" size="sm" onClick={() => handleReserve(c)}>Réserver</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal de réservation */}
      {showReservationModal && selectedCar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Réserver {selectedCar.name}</h2>
              <button onClick={() => setShowReservationModal(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>
            <div className="aspect-video rounded-lg overflow-hidden">
              <img src={selectedCar.img} alt={selectedCar.name} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="bg-transparent text-sm outline-none flex-1"
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="bg-transparent text-sm outline-none flex-1"
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <input
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Lieu de retrait"
                  className="bg-transparent text-sm outline-none flex-1"
                />
              </div>
            </div>
            <div className="bg-gold/10 border border-gold/30 rounded-xl p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Prix estimé</span>
                <span className="font-bold text-gold-foreground">{selectedCar.price} FCFA / jour</span>
              </div>
            </div>
            <Button variant="hero" className="w-full" onClick={handleConfirmReservation}>
              Confirmer la réservation
            </Button>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
