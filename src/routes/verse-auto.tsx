import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Wallet, ShieldCheck, ChevronDown, Landmark, Sparkles, TrendingUp, CheckCircle, Percent } from "lucide-react";

export const Route = createFileRoute("/verse-auto")({
  head: () => ({
    meta: [
      { title: "Verse Auto — Investissez et gagnez mensuellement | Matt Group" },
      { name: "description", content: "Faites fructifier votre épargne en investissant dans la mobilité à Dakar. Générez des revenus mensuels passifs et sécurisés." },
    ],
  }),
  component: VerseAutoPage,
});

function VerseAutoPage() {
  const [amount, setAmount] = useState<number>(3000000);
  const [coInvestors, setCoInvestors] = useState<number>(1);
  const [nom, setNom] = useState("");
  const [phone, setPhone] = useState("");

  const simulation = useMemo(() => {
    // Calcul de rendement : ~15% par an d'intérêt brut, divisé par le nombre de co-investisseurs
    const annualReturn = amount * 0.15;
    const monthlyTotal = Math.round(annualReturn / 12);
    const monthlyPerUser = Math.round(monthlyTotal / coInvestors);
    return {
      monthly: monthlyPerUser,
      annual: monthlyPerUser * 12,
      yieldRate: "15%",
    };
  }, [amount, coInvestors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom || !phone) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    toast.success("Demande d'investissement reçue ! Un conseiller Matt Group vous contactera sous 24h.");
    setNom("");
    setPhone("");
  };

  const faqs = [
    { q: "Comment sont générés mes revenus ?", a: "Votre investissement sert à financer l'achat de véhicules récents qui sont ensuite exploités sur notre plateforme de VTC premium ou de location. Les revenus générés par les courses couvrent le rendement mensuel garanti." },
    { q: "Qui s'occupe de l'entretien et des pannes ?", a: "Matt Group gère l'entretien complet du véhicule, les réparations, le contrôle technique ainsi que le recrutement et la formation des chauffeurs. Vous n'avez aucun effort opérationnel à fournir." },
    { q: "Quelles sont les garanties de sécurité ?", a: "Chaque véhicule est assuré tous risques auprès de nos partenaires (comme La Providence) et équipé d'un traceur GPS 24/7. De plus, un contrat notarié garantit votre part de propriété." },
    { q: "Quand vais-je recevoir mes premiers paiements ?", a: "Les virements sont effectués automatiquement sur votre compte bancaire, Wave ou Orange Money le 5 de chaque mois, dès le premier mois suivant l'intégration du véhicule." }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <SiteLayout>
      {/* Header section */}
      <section className="bg-hero text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative mx-auto max-w-4xl px-4 text-center space-y-5">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-1.5 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Rentabilité & Mobilité
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold">Votre voiture peut vous rapporter chaque mois</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Investissez à plusieurs ou confiez votre véhicule à Matt Group et percevez des revenus mensuels garantis sans les soucis de gestion.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-12 gap-12">
        {/* Left Column: Simulator */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-card border border-border rounded-3xl p-6 lg:p-8 shadow-soft space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gold/15 text-gold-foreground grid place-items-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-bold">Simulateur de Rendement</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <Label>Montant de l'investissement (FCFA)</Label>
                  <span className="text-primary font-bold">{amount.toLocaleString()} FCFA</span>
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={15000000}
                  step={500000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-gold"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 000 000 FCFA</span>
                  <span>15 000 000 FCFA</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nombre de co-investisseurs</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCoInvestors(n)}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                        coInvestors === n
                          ? "border-gold bg-gold/10 text-foreground"
                          : "border-border hover:border-gold/50"
                      }`}
                    >
                      {n === 1 ? "1 Seul (100%)" : `${n} personnes`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Render results */}
            <div className="bg-primary text-primary-foreground rounded-2xl p-6 space-y-4 relative overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-10" />
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <div className="text-xs text-white/70 uppercase tracking-wider font-semibold">Revenu mensuel estimé</div>
                  <div className="text-3xl font-extrabold text-gradient-gold mt-1">
                    {simulation.monthly.toLocaleString()} FCFA
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/70">Rendement Annuel</div>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {simulation.annual.toLocaleString()} FCFA
                  </div>
                </div>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between text-xs text-white/60">
                <span>Taux de rendement brut : {simulation.yieldRate}</span>
                <span>Frais de gestion inclus (0 FCFA)</span>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
              <div className="h-9 w-9 rounded-lg bg-success/15 text-success grid place-items-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm">Gestion 100% déléguée</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Nous nous occupons de tout : recrutement du chauffeur, pannes, assurance et suivi client.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
              <div className="h-9 w-9 rounded-lg bg-success/15 text-success grid place-items-center">
                <Landmark className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm">Revenus garantis</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Un rendement régulier et stable versé le 5 de chaque mois directement par virement ou mobile money.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Contact form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card border border-border rounded-3xl p-6 lg:p-8 shadow-soft">
            <h3 className="font-display text-xl font-bold">Devenir investisseur</h3>
            <p className="text-xs text-muted-foreground mt-1">Remplissez ce formulaire et un expert Verse Auto vous contactera.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="nom">Nom complet *</Label>
                <Input
                  id="nom"
                  placeholder="Mamadou Diop"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Numéro de téléphone *</Label>
                <Input
                  id="phone"
                  placeholder="+221 77 000 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="invest-amount">Budget d'investissement souhaité (FCFA)</Label>
                <select className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:border-gold">
                  <option>1 000 000 - 3 000 000 FCFA</option>
                  <option>3 000 000 - 6 000 000 FCFA</option>
                  <option>6 000 000 FCFA et plus</option>
                </select>
              </div>

              <Button type="submit" variant="hero" className="w-full mt-4 rounded-xl">
                Soumettre ma demande
              </Button>
            </form>
          </div>

          {/* FAQ specific */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-soft">
            <h4 className="font-display font-semibold text-sm mb-4">Questions fréquentes</h4>
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-border last:border-0 pb-2 last:pb-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold py-1 hover:text-gold transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === idx && (
                    <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
