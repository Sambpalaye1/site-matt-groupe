import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plane, Bus, Calendar, MapPin, Search, ArrowRight, UserPlus, Sparkles, CreditCard, ChevronRight, Check } from "lucide-react";

export const Route = createFileRoute("/billetterie")({
  head: () => ({
    meta: [
      { title: "Billetterie & Vols — Réservez vos trajets au Sénégal | Matt Group" },
      { name: "description", content: "Réservez vos vols nationaux/internationaux et vos bus interurbains au Sénégal. Les tarifs les plus bas, paiements sécurisés par Wave." },
    ],
  }),
  component: BilletteriePage,
});

type Mode = "flight" | "bus";
type TicketOffer = {
  id: string;
  provider: string;
  from: string;
  to: string;
  time: string;
  duration: string;
  price: number;
};

const MOCK_FLIGHTS: TicketOffer[] = [
  { id: "f1", provider: "Air Sénégal", from: "Dakar (DSS)", to: "Ziguinchor (ZIG)", time: "08:30 - 09:15", duration: "45m", price: 55000 },
  { id: "f2", provider: "Air Sénégal", from: "Dakar (DSS)", to: "Paris (CDG)", time: "11:45 - 18:30", duration: "5h 45m", price: 345000 },
  { id: "f3", provider: "Transair", from: "Dakar (DSS)", to: "Cap Skirring (CSK)", time: "14:15 - 15:10", duration: "55m", price: 65000 },
];

const MOCK_BUS: TicketOffer[] = [
  { id: "b1", provider: "Dakar Dem Dikk", from: "Dakar", to: "Saint-Louis", time: "07:00 - 11:30", duration: "4h 30m", price: 7000 },
  { id: "b2", provider: "Dakar Dem Dikk", from: "Dakar", to: "Touba", time: "08:30 - 11:30", duration: "3h 00m", price: 5000 },
  { id: "b3", provider: "Al Azhar", from: "Dakar", to: "Ziguinchor", time: "18:00 - 06:00", duration: "12h 00m", price: 9000 },
];

function BilletteriePage() {
  const [mode, setMode] = useState<Mode>("flight");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState<TicketOffer[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<TicketOffer | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !date) {
      toast.error("Veuillez renseigner le départ, la destination et la date");
      return;
    }
    setSearching(true);
    setResults(null);
    setTimeout(() => {
      setResults(mode === "flight" ? MOCK_FLIGHTS : MOCK_BUS);
      setSearching(false);
      toast.success("Offres trouvées pour votre trajet");
    }, 1200);
  };

  const handleSelectOffer = (offer: TicketOffer) => {
    setSelectedOffer(offer);
    setShowBookingModal(true);
    setPaid(false);
  };

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaid(true);
      toast.success("Billet réservé avec succès ! Reçu envoyé par SMS & Email.");
    }, 1800);
  };

  return (
    <SiteLayout>
      {/* Header section */}
      <section className="bg-hero text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative mx-auto max-w-4xl px-4 text-center space-y-5">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-1.5 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Billetterie Digitale
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold">Réservez vos billets au meilleur prix</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Vols intérieurs & internationaux, bus interurbains ou événements culturels — achetez vos tickets en toute sécurité.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 space-y-8">
        {/* Search Panel */}
        <div className="bg-card border border-border rounded-3xl p-6 lg:p-8 shadow-soft space-y-6">
          <div className="bg-muted/60 rounded-2xl p-1.5 flex max-w-xs mx-auto md:mx-0">
            <button
              onClick={() => { setMode("flight"); setResults(null); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === "flight" ? "bg-card shadow-soft" : "text-muted-foreground"}`}
            >
              <Plane className="h-4 w-4" /> Vols / Avion
            </button>
            <button
              onClick={() => { setMode("bus"); setResults(null); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === "bus" ? "bg-card shadow-soft" : "text-muted-foreground"}`}
            >
              <Bus className="h-4 w-4" /> Bus Interurbains
            </button>
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <Label>Lieu de départ</Label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={mode === "flight" ? "Ex: Dakar (DSS)" : "Ex: Dakar"}
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="bg-transparent text-sm outline-none flex-1"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Destination</Label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={mode === "flight" ? "Ex: Ziguinchor (ZIG)" : "Ex: Saint-Louis"}
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="bg-transparent text-sm outline-none flex-1"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Date de départ</Label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent text-sm outline-none flex-1"
                />
              </div>
            </div>

            <Button type="submit" variant="hero" className="h-11 rounded-xl w-full flex items-center justify-center gap-2 font-bold cursor-pointer">
              <Search className="h-4 w-4" /> {searching ? "Recherche..." : "Rechercher"}
            </Button>
          </form>
        </div>

        {/* Results section */}
        {searching && (
          <div className="text-center py-12 space-y-3">
            <div className="mx-auto h-12 w-12 rounded-full border-4 border-gold/30 border-t-gold animate-spin" />
            <p className="text-sm text-muted-foreground">Recherche des meilleurs tarifs disponibles...</p>
          </div>
        )}

        {results && (
          <div className="space-y-4 animate-fade-up">
            <h2 className="font-display text-lg font-bold">Offres disponibles ({results.length})</h2>
            <div className="grid gap-4">
              {results.map((offer) => (
                <div key={offer.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-elegant transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
                      {mode === "flight" ? <Plane className="h-6 w-6" /> : <Bus className="h-6 w-6" />}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-primary">{offer.provider}</div>
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <span className="font-semibold">{offer.from}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-semibold">{offer.to}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-3 md:pt-0">
                    <div className="text-left md:text-right">
                      <div className="text-xs text-muted-foreground font-semibold">{offer.time}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Durée: {offer.duration}</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-lg font-extrabold text-primary">{offer.price.toLocaleString()} FCFA</div>
                        <div className="text-[10px] text-muted-foreground text-right">TTC / passager</div>
                      </div>
                      <Button variant="hero" size="sm" className="rounded-lg" onClick={() => handleSelectOffer(offer)}>
                        Réserver
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Booking confirmation modal */}
      {showBookingModal && selectedOffer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 space-y-5 animate-fade-up">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">Détails de la réservation</h3>
              <button onClick={() => setShowBookingModal(false)} className="h-8 w-8 grid place-items-center rounded-full hover:bg-muted text-muted-foreground">
                ✕
              </button>
            </div>

            {!paid ? (
              <div className="space-y-4">
                <div className="bg-secondary/50 rounded-2xl p-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type de transport</span>
                    <span className="font-semibold">{mode === "flight" ? "Vol / Avion" : "Bus Interurbain"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compagnie</span>
                    <span className="font-semibold text-primary">{selectedOffer.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Itinéraire</span>
                    <span className="font-semibold">{selectedOffer.from} → {selectedOffer.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Horaire / Durée</span>
                    <span className="font-semibold">{selectedOffer.time} ({selectedOffer.duration})</span>
                  </div>
                </div>

                <div className="bg-gold/10 border border-gold/30 rounded-2xl p-4 flex justify-between items-center">
                  <span className="text-sm font-semibold">Total à payer</span>
                  <span className="font-display text-xl font-bold text-gold-foreground">{selectedOffer.price.toLocaleString()} FCFA</span>
                </div>

                <div className="space-y-2">
                  <Label>Sélectionner le mode de paiement</Label>
                  <button onClick={handlePay} disabled={paying} className="w-full flex items-center justify-between p-3.5 border border-border hover:border-gold rounded-xl text-left bg-card cursor-pointer transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-[#1DC8FF]/10 text-[#0099CC] rounded-lg grid place-items-center font-bold">W</div>
                      <div>
                        <div className="text-sm font-bold">Wave</div>
                        <div className="text-xs text-muted-foreground">Frais de transaction : 0 FCFA</div>
                      </div>
                    </div>
                    {paying ? <div className="h-4 w-4 rounded-full border-2 border-gold border-t-transparent animate-spin" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-success/15 text-success grid place-items-center">
                  <Check className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold">Réservation confirmée !</h4>
                  <p className="text-sm text-muted-foreground mt-1">Votre billet électronique a été généré et est disponible.</p>
                </div>
                <div className="border border-dashed border-border rounded-xl p-4 bg-muted/30 text-xs space-y-2 text-left">
                  <div className="flex justify-between"><span>Réf Billet</span><span className="font-mono font-bold">MTT-{Math.floor(100000 + Math.random() * 900000)}</span></div>
                  <div className="flex justify-between"><span>Passager</span><span className="font-bold">Utilisateur Matt Group</span></div>
                  <div className="flex justify-between"><span>Date de départ</span><span className="font-bold">{date}</span></div>
                </div>
                <Button variant="premium" className="w-full rounded-xl" onClick={() => setShowBookingModal(false)}>
                  Fermer
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
