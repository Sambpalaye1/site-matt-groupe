import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Shield, Car, Bike, Briefcase, Building2, Check, ArrowRight, ArrowLeft,
  FileDown, Loader2, Smartphone, CreditCard, QrCode,
} from "lucide-react";
import providenceLogo from "@/assets/logo-providence.png";
import {
  calculateQuote, formatFCFA,
  type Categorie, type PuissanceFiscale, type Usage, type Formule, type Compagnie,
} from "@/lib/insurance-quote";
import {
  generateAttestationPDF, genPoliceNumero, genAttestationNumero, genCleSecurite,
} from "@/lib/attestation-pdf";

export const Route = createFileRoute("/assurance")({
  head: () => ({
    meta: [
      { title: "Assurance Auto Digitale — Matt Group × La Providence" },
      { name: "description", content: "Souscrivez votre assurance auto en 3 minutes avec La Providence. Devis instantané, paiement Wave / Orange Money, attestation PDF avec QR code." },
    ],
  }),
  component: AssurancePage,
});

type FormState = {
  nom: string; telephone: string;
  marque: string; modele: string; immatriculation: string; premiereCirculation: string; kilometrage?: number;
  categorie: Categorie | ""; cv: PuissanceFiscale | "";
  usage: Usage | ""; formule: Formule | ""; compagnie: Compagnie;
  dureeMois: number;
};

const CATEGORIES: { id: Categorie; label: string; icon: typeof Car }[] = [
  { id: "particulier", label: "Véhicule particulier", icon: Car },
  { id: "moto_jakarta", label: "Moto Jakarta", icon: Bike },
  { id: "tricycle", label: "Moto / Tricycle 3 roues", icon: Bike },
  { id: "scooter_plus", label: "Scooter + de 125 cm³", icon: Bike },
  { id: "scooter_moins", label: "Scooter - de 125 cm³", icon: Bike },
  { id: "utilitaire", label: "Véhicule utilitaire", icon: Car },
];
const CVS: { id: PuissanceFiscale; label: string }[] = [
  { id: "2", label: "2 CV" }, { id: "3-6", label: "3 à 6 CV" }, { id: "7-10", label: "7 à 10 CV" },
  { id: "11-14", label: "11 à 14 CV" }, { id: "15-23", label: "15 à 23 CV" }, { id: "24+", label: "24 CV & plus" },
];
const MARQUES_COMMUNES = [
  "Toyota", "Hyundai", "Kia", "Nissan", "Mitsubishi", "Honda", "Suzuki", "Mercedes", "BMW", "Peugeot", "Renault", "Dacia", "Ford", "Chevrolet"
];
const MODELES_TOYOTA = ["Corolla", "Yaris", "Camry", "Hilux", "Land Cruiser", "RAV4", "Prado"];
const MODELES_HYUNDAI = ["i10", "i20", "i30", "Accent", "Elantra", "Santa Fe", "Tucson"];
const MODELES_KIA = ["Picanto", "Rio", "Cerato", "Sportage", "Sorento", "Carnival"];
const USAGES: { id: Usage; emoji: string; title: string; desc: string }[] = [
  { id: "particulier", emoji: "🛡️", title: "Particulier", desc: "Trajets privés et domicile-travail" },
  { id: "commercial", emoji: "💼", title: "Commercial / Affaires", desc: "Visites clients, livraisons légères" },
  { id: "public", emoji: "🏢", title: "Transport public", desc: "Taxi, VTC, transport de marchandises" },
];
const FORMULES: { id: Formule; title: string; desc: string }[] = [
  { id: "rc", title: "Responsabilité Civile (RC)", desc: "Couverture obligatoire — dommages aux tiers" },
  { id: "rc_vol", title: "RC + Vol & Incendie", desc: "RC + protection contre vol et incendie" },
  { id: "tous_risques", title: "Tous Risques", desc: "Protection complète : RC, vol, incendie, dommages, bris de glace" },
];
const COMPAGNIES: { id: Compagnie; name: string; tag: string; partner?: boolean }[] = [
  { id: "allianz", name: "Allianz Sénégal", tag: "Leader international, sinistres < 48h" },
  { id: "askia", name: "Askia Assurances", tag: "Acteur sénégalais de référence" },
  { id: "finafrica", name: "Finafrica Assurances", tag: "Tarifs compétitifs, service rapide" },
  { id: "providence", name: "La Providence", tag: "Partenaire officiel · Couverture étendue", partner: true },
];
const DUREES = [1, 2, 3, 6, 12];

const initial: FormState = {
  nom: "", telephone: "", marque: "", modele: "", immatriculation: "", premiereCirculation: "", kilometrage: undefined,
  categorie: "", cv: "", usage: "", formule: "", compagnie: "providence", dureeMois: 12,
};

function AssurancePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initial);
  const [showQuote, setShowQuote] = useState(false);
  const [paying, setPaying] = useState<null | "wave" | "om" | "card">(null);
  const [paid, setPaid] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  const quote = useMemo(() => {
    if (!form.categorie || !form.cv || !form.usage || !form.formule) return null;
    return calculateQuote({
      categorie: form.categorie, cv: form.cv, usage: form.usage,
      formule: form.formule, compagnie: form.compagnie, dureeMois: form.dureeMois,
    });
  }, [form]);

  const canNext = (s: number) => {
    if (s === 1) return form.nom.trim().length > 1 && form.telephone.trim().length >= 9;
    if (s === 2) return form.marque && form.modele && form.immatriculation && form.premiereCirculation;
    if (s === 3) return form.categorie && form.cv;
    if (s === 4) return !!form.usage;
    if (s === 5) return !!form.formule;
    if (s === 6) return !!form.compagnie;
    if (s === 7) return form.dureeMois > 0;
    return true;
  };

  const pay = (method: "wave" | "om" | "card") => {
    setPaying(method);
    setTimeout(() => { setPaying(null); setPaid(true); toast.success("Paiement confirmé · Attestation prête"); }, 1800);
  };

  const download = async () => {
    if (!quote) return;
    setDownloading(true);
    try {
      const start = new Date();
      const end = new Date(); end.setMonth(end.getMonth() + form.dureeMois);
      const blob = await generateAttestationPDF({
        souscripteur: form.nom, telephone: form.telephone,
        marque: form.marque, modele: form.modele,
        immatriculation: form.immatriculation || "—",
        premiereCirculation: form.premiereCirculation,
        categorie: CATEGORIES.find((c) => c.id === form.categorie)?.label || "",
        puissanceFiscale: CVS.find((c) => c.id === form.cv)?.label || "",
        nombrePlaces: form.categorie === "particulier" ? 5 : 2,
        formule: FORMULES.find((f) => f.id === form.formule)?.title || "",
        dureeMois: form.dureeMois, dateDebut: start, dateFin: end, prime: quote.total,
        policeNumero: genPoliceNumero(), attestationNumero: genAttestationNumero(), cleSecurite: genCleSecurite(),
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url;
      a.download = `attestation-providence-${form.nom.replace(/\s+/g, "-")}.pdf`;
      a.click(); URL.revokeObjectURL(url);
    } finally { setDownloading(false); }
  };

  return (
    <SiteLayout>
      <section className="bg-hero text-primary-foreground py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative mx-auto max-w-5xl px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-1.5 text-xs font-medium">
            <Shield className="h-3.5 w-3.5 text-gold" /> Partenaire officiel <strong className="font-bold">La Providence</strong>
          </div>
          <h1 className="font-display text-3xl lg:text-5xl font-bold leading-tight">
            Votre assurance auto, <span className="text-gradient-gold">en 3 minutes</span>.
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Devis instantané · Paiement Wave / Orange Money · Attestation PDF avec QR code, vérifiable en ligne.
          </p>
          <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-4 py-2 shadow-elegant">
            <img src={providenceLogo} alt="La Providence" className="h-10 w-auto" />
            <div className="text-left">
              <div className="text-xs text-muted-foreground">Émetteur agréé</div>
              <div className="text-sm font-bold text-primary">Assurances La Providence</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">Étape {step} sur {totalSteps}</span>
            <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {/* Stepper */}
        <div className="mb-8 grid grid-cols-7 gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <div key={n} className={`h-1.5 rounded-full transition-all ${n <= step ? "bg-gold" : "bg-border"}`} />
          ))}
        </div>
        <div className="mb-2 text-sm text-muted-foreground">Étape {step} / 7</div>

        <div className="bg-card border border-border rounded-3xl p-6 lg:p-10 shadow-soft">
          {step === 1 && (
            <Step title="Vos coordonnées">
              <Field label="Nom complet *"><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Madické Wade" /></Field>
              <Field label="Téléphone *"><Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="+221 77 000 00 00" /></Field>
            </Step>
          )}
          {step === 2 && (
            <Step title="Votre véhicule">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Marque *">
                  <select value={form.marque} onChange={(e) => setForm({ ...form, marque: e.target.value, modele: "" })}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:border-gold">
                    <option value="">Sélectionnez</option>
                    {MARQUES_COMMUNES.map((m) => <option key={m} value={m}>{m}</option>)}
                    <option value="autre">Autre</option>
                  </select>
                </Field>
                <Field label="Modèle *">
                  {form.marque === "Toyota" ? (
                    <select value={form.modele} onChange={(e) => setForm({ ...form, modele: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:border-gold">
                      <option value="">Sélectionnez</option>
                      {MODELES_TOYOTA.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  ) : form.marque === "Hyundai" ? (
                    <select value={form.modele} onChange={(e) => setForm({ ...form, modele: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:border-gold">
                      <option value="">Sélectionnez</option>
                      {MODELES_HYUNDAI.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  ) : form.marque === "Kia" ? (
                    <select value={form.modele} onChange={(e) => setForm({ ...form, modele: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:border-gold">
                      <option value="">Sélectionnez</option>
                      {MODELES_KIA.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  ) : (
                    <Input value={form.modele} onChange={(e) => setForm({ ...form, modele: e.target.value })} placeholder="Modèle" disabled={!form.marque} />
                  )}
                </Field>
                <Field label="Immatriculation *"><Input value={form.immatriculation} onChange={(e) => setForm({ ...form, immatriculation: e.target.value.toUpperCase() })} placeholder="DK 0060 BE" /></Field>
                <Field label="Année du véhicule *">
                  <select value={form.premiereCirculation?.substring(0, 4) || ""} onChange={(e) => setForm({ ...form, premiereCirculation: `${e.target.value}-01-01` })}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:border-gold">
                    <option value="">Sélectionnez</option>
                    {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Kilométrage (optionnel)" className="sm:col-span-2">
                  <Input type="number" value={form.kilometrage || ""} onChange={(e) => setForm({ ...form, kilometrage: Number(e.target.value) || undefined })} placeholder="Ex: 50000 km" />
                </Field>
              </div>
            </Step>
          )}
          {step === 3 && (
            <Step title="Catégorie & puissance">
              <Label className="text-sm font-semibold">Catégorie de véhicule *</Label>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                {CATEGORIES.map((c) => (
                  <Pick key={c.id} active={form.categorie === c.id} onClick={() => setForm({ ...form, categorie: c.id })}>
                    <c.icon className="h-5 w-5 text-primary" />
                    <span className="font-medium text-sm">{c.label}</span>
                  </Pick>
                ))}
              </div>
              <Label className="text-sm font-semibold mt-6 block">Puissance fiscale (CV) *</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-3">
                {CVS.map((c) => (
                  <button key={c.id} onClick={() => setForm({ ...form, cv: c.id })}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.cv === c.id ? "border-gold bg-gold/10 text-foreground" : "border-border hover:border-gold/50"}`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </Step>
          )}
          {step === 4 && (
            <Step title="Usage du véhicule">
              <div className="grid md:grid-cols-3 gap-3">
                {USAGES.map((u) => (
                  <Pick key={u.id} active={form.usage === u.id} onClick={() => setForm({ ...form, usage: u.id })} className="flex-col items-start text-left p-5 gap-1">
                    <div className="text-3xl">{u.emoji}</div>
                    <div className="font-semibold mt-2">{u.title}</div>
                    <div className="text-xs text-muted-foreground">{u.desc}</div>
                  </Pick>
                ))}
              </div>
            </Step>
          )}
          {step === 5 && (
            <Step title="Type d'assurance">
              <div className="space-y-3">
                {FORMULES.map((f) => (
                  <Pick key={f.id} active={form.formule === f.id} onClick={() => setForm({ ...form, formule: f.id })} className="flex-row items-start p-5 gap-4">
                    <div className={`h-5 w-5 rounded-full border-2 mt-0.5 shrink-0 grid place-items-center ${form.formule === f.id ? "border-gold bg-gold" : "border-border"}`}>
                      {form.formule === f.id && <Check className="h-3 w-3 text-gold-foreground" />}
                    </div>
                    <div>
                      <div className="font-semibold">{f.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{f.desc}</div>
                    </div>
                  </Pick>
                ))}
              </div>
            </Step>
          )}
          {step === 6 && (
            <Step title="Compagnie d'assurance">
              <div className="grid sm:grid-cols-2 gap-3">
                {COMPAGNIES.map((c) => (
                  <Pick key={c.id} active={form.compagnie === c.id} onClick={() => setForm({ ...form, compagnie: c.id })} className="flex-row items-center p-4 gap-3 relative">
                    {c.partner && <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-gold text-gold-foreground text-[10px] font-bold">PARTENAIRE ✓</span>}
                    <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center font-bold text-primary text-sm">{c.name[0]}</div>
                    <div>
                      <div className="font-semibold text-sm">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.tag}</div>
                    </div>
                  </Pick>
                ))}
              </div>
            </Step>
          )}
          {step === 7 && (
            <Step title="Durée de couverture">
              <div className="flex flex-wrap gap-2">
                {DUREES.map((d) => (
                  <button key={d} onClick={() => setForm({ ...form, dureeMois: d })}
                    className={`px-5 py-2.5 rounded-xl border font-medium text-sm transition-all ${form.dureeMois === d ? "border-gold bg-gold/10" : "border-border hover:border-gold/50"}`}>
                    {d === 12 ? "1 an" : `${d} mois`}
                  </button>
                ))}
              </div>
              <Field label="Durée personnalisée (en mois)" className="mt-6 max-w-xs">
                <Input type="number" min={1} max={24} value={form.dureeMois} onChange={(e) => setForm({ ...form, dureeMois: Number(e.target.value) || 1 })} />
              </Field>
            </Step>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
              <ArrowLeft className="h-4 w-4" /> Retour
            </Button>
            {step < 7 ? (
              <Button variant="premium" onClick={() => setStep(step + 1)} disabled={!canNext(step)}>
                Continuer <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="hero" onClick={() => setShowQuote(true)} disabled={!canNext(7) || !quote}>
                Calculer mon devis <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Quote + Payment */}
        {showQuote && quote && (
          <div className="mt-10 grid lg:grid-cols-2 gap-6 animate-fade-up">
            <div className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground rounded-3xl p-8 shadow-elegant">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">
                <Shield className="h-4 w-4 text-gold" /> Devis instantané · La Providence
              </div>
              <div className="mt-6">
                <div className="text-sm opacity-75">Prime totale ({form.dureeMois} mois)</div>
                <div className="font-display text-5xl font-bold mt-1 text-gradient-gold">{formatFCFA(quote.total)}</div>
              </div>
              <div className="mt-6 space-y-2 text-sm border-t border-white/10 pt-4">
                <Row k="Prime annuelle" v={formatFCFA(quote.annual)} />
                <Row k={`Pro-rata ${form.dureeMois} mois`} v={formatFCFA(quote.prorata)} />
                <Row k="Frais de dossier" v={formatFCFA(quote.fraisDossier)} />
              </div>
              <div className="mt-6 text-xs opacity-70">
                Devis fourni par l'API La Providence · Valide 24h · Conforme DGT Sénégal
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8">
              {!paid ? (
                <>
                  <h3 className="font-display font-bold text-xl">Paiement sécurisé</h3>
                  <p className="text-sm text-muted-foreground mt-1">Choisissez votre moyen de paiement.</p>
                  <div className="mt-5 space-y-2.5">
                    <PayButton onClick={() => pay("wave")} loading={paying === "wave"} icon={<Smartphone className="h-5 w-5" />} label="Wave" sub="Paiement instantané · 0 frais" color="bg-[#1DC8FF]/10 text-[#0099CC]" />
                    <PayButton onClick={() => pay("om")} loading={paying === "om"} icon={<Smartphone className="h-5 w-5" />} label="Orange Money" sub="USSD ou app · confirmation < 30s" color="bg-orange-500/10 text-orange-600" />
                    <PayButton onClick={() => pay("card")} loading={paying === "card"} icon={<CreditCard className="h-5 w-5" />} label="Carte bancaire" sub="Visa, Mastercard · 3-D Secure" color="bg-primary/8 text-primary" />
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-success/10 grid place-items-center">
                    <Check className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="font-display font-bold text-xl mt-4">Paiement confirmé</h3>
                  <p className="text-sm text-muted-foreground mt-1">Votre attestation La Providence est prête.</p>
                  <Button variant="hero" size="lg" className="mt-6 w-full" onClick={download} disabled={downloading}>
                    {downloading ? <><Loader2 className="h-4 w-4 animate-spin" /> Génération…</> : <><FileDown className="h-4 w-4" /> Télécharger l'attestation PDF</>}
                  </Button>
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <QrCode className="h-3.5 w-3.5" /> Avec QR code de vérification
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5 animate-fade-up">
      <h2 className="font-display text-2xl font-bold text-primary">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={`space-y-1.5 ${className}`}><Label className="text-sm font-medium">{label}</Label>{children}</div>;
}
function Pick({ active, onClick, children, className = "" }: { active: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${active ? "border-gold bg-gold/5 shadow-soft" : "border-border hover:border-gold/40 hover:bg-secondary/40"} ${className}`}>
      {children}
    </button>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><span className="opacity-75">{k}</span><span className="font-semibold">{v}</span></div>;
}
function PayButton({ onClick, loading, icon, label, sub, color }: { onClick: () => void; loading: boolean; icon: React.ReactNode; label: string; sub: string; color: string }) {
  return (
    <button onClick={onClick} disabled={loading}
      className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:border-gold transition-all text-left disabled:opacity-60">
      <div className={`h-10 w-10 rounded-xl grid place-items-center ${color}`}>{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : icon}</div>
      <div className="flex-1"><div className="font-semibold text-sm">{label}</div><div className="text-xs text-muted-foreground">{sub}</div></div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
