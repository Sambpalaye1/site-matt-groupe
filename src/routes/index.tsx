import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Shield, Car, Key, Wallet, Ticket, CheckCircle2, Star, MapPin, Clock, BadgeCheck, Sparkles, ChevronDown, Smartphone, CreditCard, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { useState } from "react";

import dakarHero from "@/assets/dakar-hero.jpg";
import appMockup from "@/assets/app-mockup.png";
import driverImg from "@/assets/driver.jpg";
import t1 from "@/assets/testimonial-1.jpg";
import t2 from "@/assets/testimonial-2.jpg";
import t3 from "@/assets/testimonial-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Matt Group Sénégal — La mobilité intelligente" },
      { name: "description", content: "VTC, assurance auto digitale, location de véhicules et paiement Wave / Orange Money. La nouvelle plateforme de mobilité du Sénégal." },
      { property: "og:title", content: "Matt Group — La mobilité intelligente au Sénégal" },
      { property: "og:description", content: "Réservez un VTC, souscrivez une assurance ou louez un véhicule en quelques secondes." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      <Hero />
      <Stats />
      <Services />
      <HowItWorks />
      <WhyUs />
      <Testimonials />
      <FAQ />
      <CTA />
    </SiteLayout>
  );
}

/* ───────── Hero ───────── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero text-primary-foreground">
      <div className="absolute inset-0 opacity-30">
        <img src={dakarHero} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
      </div>
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-1.5 text-xs font-medium animate-fade-up">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Nouveau · Disponible à Dakar, Thiès & AIBD
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight animate-fade-up-delay-1">
              La mobilité <span className="text-gradient-gold">intelligente</span><br />
              au Sénégal.
            </h1>

            <p className="text-lg text-primary-foreground/80 max-w-xl leading-relaxed animate-fade-up-delay-2">
              Réservez un VTC, souscrivez une assurance auto, louez un véhicule
              ou payez en FCFA via Wave & Orange Money — depuis une seule application.
            </p>

            <div className="flex flex-wrap gap-3 animate-fade-up-delay-3">
              <Link to="/login">
                <Button variant="hero" size="xl">
                  Commencer gratuitement <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/vtc">
                <Button variant="glass" size="xl">Découvrir le VTC</Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6">
              <TrustItem icon={<BadgeCheck className="h-4 w-4 text-gold" />} text="Chauffeurs vérifiés" />
              <TrustItem icon={<Shield className="h-4 w-4 text-gold" />} text="Paiements sécurisés" />
              <TrustItem icon={<Clock className="h-4 w-4 text-gold" />} text="Disponible 24h/24" />
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative animate-float">
              <div className="absolute -inset-10 bg-gold/20 blur-3xl rounded-full" />
              <img src={appMockup} alt="Application Matt Group" className="relative w-full max-w-md mx-auto" />
            </div>

            {/* Floating cards */}
            <div className="hidden md:flex absolute top-10 -left-4 glass-dark rounded-2xl p-3 pr-5 gap-3 items-center shadow-elegant animate-fade-up-delay-2">
              <div className="h-10 w-10 rounded-xl bg-success grid place-items-center">
                <CheckCircle2 className="h-5 w-5 text-success-foreground" />
              </div>
              <div>
                <div className="text-xs text-primary-foreground/60">Paiement</div>
                <div className="text-sm font-semibold">3 500 FCFA · Wave</div>
              </div>
            </div>

            <div className="hidden md:flex absolute bottom-10 -right-2 glass-dark rounded-2xl p-3 pr-5 gap-3 items-center shadow-elegant animate-fade-up-delay-3">
              <img src={driverImg} alt="" className="h-10 w-10 rounded-xl object-cover" loading="lazy" />
              <div>
                <div className="text-xs text-primary-foreground/60">Mamadou arrive</div>
                <div className="text-sm font-semibold">dans 3 min · ★ 4.9</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
      {icon} {text}
    </div>
  );
}

/* ───────── Stats ───────── */
function Stats() {
  const items = [
    { k: "12 400+", v: "Chauffeurs actifs" },
    { k: "850 K", v: "Courses réalisées" },
    { k: "98%", v: "Clients satisfaits" },
    { k: "24 000", v: "Assurances générées" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
      <div className="bg-card rounded-3xl shadow-elegant border border-border p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((it) => (
          <div key={it.v}>
            <div className="font-display text-3xl lg:text-4xl font-bold text-primary">{it.k}</div>
            <div className="text-sm text-muted-foreground mt-1">{it.v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────── Services ───────── */
function Services() {
  const services = [
    { icon: Shield, title: "Assurance Auto", desc: "Souscrivez en 3 minutes, attestation PDF avec QR code instantanée.", to: "/assurance", color: "bg-success/10 text-success" },
    { icon: Car, title: "VTC", desc: "Réservez un chauffeur professionnel partout à Dakar et alentours.", to: "/vtc", color: "bg-gold/15 text-gold-foreground" },
    { icon: Key, title: "Location Véhicules", desc: "Citadines, berlines, SUV, minibus — réservation flexible 24/7.", to: "/location", color: "bg-primary/10 text-primary" },
    { icon: Wallet, title: "Verse Auto", desc: "Paiements mobiles Wave et Orange Money intégrés en FCFA.", to: "/verse-auto", color: "bg-success/10 text-success" },
    { icon: Ticket, title: "Billetterie", desc: "Réservez vos trajets longue distance et événements urbains.", to: "/billetterie", color: "bg-gold/15 text-gold-foreground" },
    { icon: Users, title: "Chauffeur dédié", desc: "Service premium avec chauffeur attitré pour entreprises.", to: "/vtc", color: "bg-primary/10 text-primary" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
      <SectionHeader
        eyebrow="Nos services"
        title="Une plateforme, tous vos besoins mobilité"
        subtitle="Du trajet quotidien à l'assurance, Matt Group réunit l'écosystème automobile sénégalais."
      />
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s) => (
          <Link key={s.title} to={s.to as any} className="group relative bg-card rounded-2xl p-6 border border-border hover:border-gold/40 hover:shadow-elegant transition-all duration-300">
            <div className={`h-12 w-12 rounded-xl grid place-items-center ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display font-semibold text-lg text-foreground">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
              Découvrir <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ───────── How it works ───────── */
function HowItWorks() {
  const steps = [
    { icon: Smartphone, title: "Créez votre compte", desc: "Inscription en 30 secondes avec votre numéro." },
    { icon: MapPin, title: "Réservez", desc: "Choisissez VTC, location ou assurance." },
    { icon: CreditCard, title: "Payez", desc: "Wave, Orange Money, carte ou cash." },
    { icon: CheckCircle2, title: "Suivez en temps réel", desc: "Notifications & GPS intégré." },
  ];
  return (
    <section className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Comment ça marche" title="Simple, rapide, sécurisé" subtitle="Quatre étapes pour profiter de tous nos services." />
        <div className="mt-14 relative">
          <div className="hidden lg:block absolute left-0 right-0 top-7 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.title} className="relative">
                <div className="relative h-14 w-14 rounded-2xl bg-card border border-border shadow-soft grid place-items-center mx-auto lg:mx-0">
                  <s.icon className="h-6 w-6 text-primary" />
                  <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gold text-gold-foreground text-xs font-bold grid place-items-center">{i + 1}</span>
                </div>
                <h3 className="mt-5 font-display font-semibold text-foreground text-center lg:text-left">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground text-center lg:text-left">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Why ───────── */
function WhyUs() {
  const items = [
    { icon: BadgeCheck, title: "Chauffeurs vérifiés", desc: "Permis, casier judiciaire et formation contrôlés." },
    { icon: Shield, title: "Paiements sécurisés", desc: "PCI DSS, 3D-Secure et chiffrement bout-en-bout." },
    { icon: Users, title: "Support local 24/7", desc: "Une équipe basée à Dakar disponible jour et nuit." },
    { icon: Clock, title: "Réservation rapide", desc: "Moins de 3 minutes pour un chauffeur près de vous." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-gold/20 to-primary/10 blur-2xl rounded-3xl" />
          <img src={driverImg} alt="Chauffeur Matt Group" className="relative rounded-3xl shadow-elegant w-full" loading="lazy" />
          <div className="absolute -bottom-6 -right-2 sm:right-6 bg-card border border-border rounded-2xl shadow-elegant p-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-success/10 grid place-items-center">
              <Star className="h-5 w-5 text-success fill-success" />
            </div>
            <div>
              <div className="font-display font-bold text-2xl text-foreground">4.9 / 5</div>
              <div className="text-xs text-muted-foreground">Note moyenne · 12k avis</div>
            </div>
          </div>
        </div>

        <div>
          <SectionHeader align="left" eyebrow="Pourquoi Matt Group" title="Construit pour le Sénégal moderne" subtitle="Une infrastructure pensée localement, opérée avec les standards internationaux." />
          <div className="mt-10 grid sm:grid-cols-2 gap-6">
            {items.map((it) => (
              <div key={it.title} className="flex gap-4">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-primary/8 grid place-items-center">
                  <it.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{it.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{it.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Testimonials ───────── */
function Testimonials() {
  const ts = [
    { name: "Aïssatou D.", role: "Plateau, Dakar", img: t1, text: "Je commande mes courses chaque jour. Les chauffeurs sont ponctuels et le paiement Wave est ultra fluide." },
    { name: "Cheikh M.", role: "Chauffeur partenaire", img: t2, text: "Depuis Matt Group, mes revenus ont doublé. La plateforme est claire et le support local répond rapidement." },
    { name: "Fatou S.", role: "Almadies", img: t3, text: "L'assurance digitale m'a sauvée. J'ai eu mon attestation en 4 minutes, dimanche soir." },
  ];
  return (
    <section className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Témoignages" title="Ils nous font confiance" subtitle="Des milliers de Sénégalais utilisent Matt Group chaque jour." />
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {ts.map((t) => (
            <div key={t.name} className="bg-card rounded-2xl p-6 border border-border shadow-soft">
              <div className="flex gap-0.5 text-gold">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-foreground leading-relaxed">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-3">
                <img src={t.img} alt={t.name} className="h-11 w-11 rounded-full object-cover" loading="lazy" />
                <div>
                  <div className="font-semibold text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── FAQ ───────── */
function FAQ() {
  const qs = [
    { q: "Comment payer avec Wave ?", a: "À la fin de la course, sélectionnez Wave. Vous serez redirigé vers votre application Wave pour confirmer le paiement en FCFA. C'est instantané." },
    { q: "Comment devenir conducteur Matt Group ?", a: "Inscrivez-vous, uploadez votre permis, carte grise et assurance. Notre équipe valide votre dossier sous 48h ouvrées." },
    { q: "Les chauffeurs sont-ils vérifiés ?", a: "Oui. Chaque chauffeur fait l'objet d'une vérification d'identité, de permis, casier judiciaire et d'une formation Matt Group." },
    { q: "Comment fonctionne l'assurance auto ?", a: "Vous renseignez votre véhicule, simulez le prix, payez via Wave/Orange Money/carte, et recevez votre attestation PDF avec QR code immédiatement." },
    { q: "Disponible dans quelles villes ?", a: "Actuellement à Dakar, Plateau, Almadies, Thiès et AIBD. Saint-Louis et Mbour arrivent en 2025." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24">
      <SectionHeader eyebrow="FAQ" title="Questions fréquentes" />
      <div className="mt-10 space-y-3">
        {qs.map((it, i) => (
          <div key={it.q} className="bg-card border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-medium text-foreground hover:bg-muted/40 transition-colors"
            >
              {it.q}
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{it.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────── CTA ───────── */
function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-hero text-primary-foreground p-10 lg:p-16 shadow-elegant">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute -top-20 -right-20 h-72 w-72 bg-gold/30 blur-3xl rounded-full" />
        <div className="relative grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold leading-tight">
              Prêt à découvrir la nouvelle mobilité sénégalaise ?
            </h2>
            <p className="mt-3 text-primary-foreground/80 max-w-lg">Créez votre compte en 30 secondes. Sans engagement, sans frais cachés.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link to="/login"><Button variant="hero" size="xl">Créer mon compte <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link to="/vtc"><Button variant="glass" size="xl">Voir la démo</Button></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Reusable ───────── */
function SectionHeader({ eyebrow, title, subtitle, align = "center" }: { eyebrow?: string; title: string; subtitle?: string; align?: "center" | "left" }) {
  const a = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${a}`}>
      {eyebrow && (
        <div className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-foreground bg-gold/15 px-3 py-1 rounded-full`}>
          {eyebrow}
        </div>
      )}
      <h2 className="mt-4 font-display text-3xl lg:text-4xl font-bold text-foreground leading-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground leading-relaxed">{subtitle}</p>}
    </div>
  );
}
