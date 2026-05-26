import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Twitter, Linkedin, Instagram, Facebook, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="[&_*]:!text-primary-foreground">
              <Logo />
            </div>
            <p className="text-sm text-primary-foreground/70 max-w-sm leading-relaxed">
              La plateforme de mobilité intelligente du Sénégal. VTC, assurance, location et paiement digital — tout en un.
            </p>
            <div className="flex gap-2">
              {[Twitter, Linkedin, Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="h-9 w-9 grid place-items-center rounded-lg bg-white/5 hover:bg-gold hover:text-gold-foreground transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Services" items={[
            { label: "VTC", to: "/vtc" },
            { label: "Assurance Auto", to: "/assurance" },
            { label: "Location", to: "/location" },
            { label: "Verse Auto", to: "/verse-auto" },
          ]} />

          <FooterCol title="Entreprise" items={[
            { label: "À propos", to: "/" },
            { label: "Carrières", to: "/" },
            { label: "Presse", to: "/" },
            { label: "Partenaires", to: "/" },
          ]} />

          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Newsletter</h4>
            <p className="text-sm text-primary-foreground/70">Les actus mobilité au Sénégal.</p>
            <form className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/50" />
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-white/5 border border-white/10 text-sm placeholder:text-primary-foreground/40 focus:outline-none focus:border-gold"
                />
              </div>
              <button className="h-10 px-4 rounded-lg bg-gold text-gold-foreground text-sm font-semibold hover:brightness-110">OK</button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} Matt Group Sénégal. Tous droits réservés. Dakar — Plateau.
          </p>
          <div className="flex gap-6 text-xs text-primary-foreground/60">
            <a href="#">Conditions</a>
            <a href="#">Confidentialité</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-sm">{title}</h4>
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
