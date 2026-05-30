import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Twitter, Linkedin, Instagram, Facebook, Mail, Phone, MapPin, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="[&_*]:!text-primary-foreground">
              <Logo light />
            </div>
            <p className="text-sm text-primary-foreground/70 max-w-sm leading-relaxed">
              La plateforme de mobilité intelligente du Sénégal. VTC, assurance, location et investissement — tout en un.
            </p>
            <div className="flex gap-2">
              {[Twitter, Linkedin, Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="h-9 w-9 grid place-items-center rounded-lg bg-white/5 hover:bg-gold hover:text-gold-foreground transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Liens Rapides" items={[
            { label: "Accueil", to: "/" },
            { label: "Assurance", to: "/assurance" },
            { label: "VTC", to: "/vtc" },
            { label: "Location", to: "/location" },
            { label: "Verse Auto", to: "/verse-auto" },
          ]} />

          <div className="space-y-4">
            <h4 className="font-semibold text-sm tracking-wider uppercase text-gold">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/75">
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-gold shrink-0" />
                <a href="tel:+221779746315" className="hover:text-gold transition-colors">77 974 63 15</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-gold shrink-0" />
                <a href="mailto:contact@mattgroup.sn" className="hover:text-gold transition-colors">contact@mattgroup.sn</a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-gold shrink-0" />
                <span>Dakar, Sénégal</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-gold shrink-0" />
                <span>Lun - Dim : 24h/24</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm tracking-wider uppercase text-gold">Newsletter</h4>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">Recevez nos offres et actualités mobilité au Sénégal.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/50" />
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-white/5 border border-white/10 text-sm placeholder:text-primary-foreground/45 focus:outline-none focus:border-gold"
                />
              </div>
              <button className="h-10 px-4 rounded-lg bg-gold text-gold-foreground text-sm font-semibold hover:brightness-110 cursor-pointer">OK</button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} MATT GROUP CORP. Tous droits réservés. Dakar, Sénégal.
          </p>
          <div className="flex gap-6 text-xs text-primary-foreground/60">
            <a href="#" className="hover:text-gold transition-colors">Conditions</a>
            <a href="#" className="hover:text-gold transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-gold transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-sm tracking-wider uppercase text-gold">{title}</h4>
      <ul className="space-y-2.5">
        {items.map((it) => (
          <li key={it.label}>
            <Link to={it.to as any} className="text-sm text-primary-foreground/70 hover:text-gold transition-colors">
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
