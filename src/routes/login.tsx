import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Mail, Lock, Eye, ArrowRight } from "lucide-react";
import { useState } from "react";
import dakarHero from "@/assets/dakar-hero.jpg";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Connexion — Matt Group Sénégal" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="relative hidden lg:block bg-hero overflow-hidden">
        <img src={dakarHero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/85 to-transparent" />
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="relative h-full flex flex-col justify-between p-12 text-primary-foreground">
          <div className="[&_*]:!text-primary-foreground"><Logo /></div>
          <div className="space-y-4 max-w-md">
            <h2 className="font-display text-4xl font-bold leading-tight">
              La mobilité <span className="text-gradient-gold">intelligente</span> au Sénégal.
            </h2>
            <p className="text-primary-foreground/80">Rejoignez 850 000 utilisateurs qui font confiance à Matt Group chaque jour.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="p-6 lg:hidden">
          <Link to="/"><Logo /></Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md space-y-6">
            <div>
              <h1 className="font-display text-3xl font-bold">{tab === "login" ? "Bon retour 👋" : "Créer mon compte"}</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                {tab === "login" ? "Connectez-vous pour accéder à votre compte." : "Inscrivez-vous en 30 secondes."}
              </p>
            </div>

            <div className="bg-muted/60 rounded-xl p-1 flex">
              <button onClick={() => setTab("login")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === "login" ? "bg-card shadow-soft" : "text-muted-foreground"}`}>Connexion</button>
              <button onClick={() => setTab("register")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === "register" ? "bg-card shadow-soft" : "text-muted-foreground"}`}>Inscription</button>
            </div>

            {tab === "register" && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Client", desc: "Réserver des services" },
                  { label: "Conducteur", desc: "Gagner avec Matt Group" },
                ].map((r, i) => (
                  <button key={r.label} className={`p-4 rounded-xl border text-left transition-all ${i === 0 ? "border-gold bg-gold/5" : "border-border hover:border-primary/40"}`}>
                    <div className="font-semibold text-sm">{r.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
            )}

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {tab === "register" && (
                <Input label="Nom complet" placeholder="Mamadou Diop" />
              )}
              <Input label="Email" icon={<Mail className="h-4 w-4" />} type="email" placeholder="vous@example.sn" />
              <Input label="Mot de passe" icon={<Lock className="h-4 w-4" />} type="password" placeholder="••••••••" trailing={<Eye className="h-4 w-4 text-muted-foreground" />} />

              {tab === "login" && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-muted-foreground">
                    <input type="checkbox" className="rounded" /> Se souvenir
                  </label>
                  <a href="#" className="text-primary font-medium hover:underline">Mot de passe oublié ?</a>
                </div>
              )}

              <Button variant="hero" size="lg" className="w-full">
                {tab === "login" ? "Se connecter" : "Créer mon compte"} <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground">ou continuer avec</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">Google</Button>
              <Button variant="outline" className="w-full">Wave</Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              En continuant, vous acceptez nos <a href="#" className="text-primary hover:underline">CGU</a> et notre <a href="#" className="text-primary hover:underline">politique de confidentialité</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, icon, trailing, ...rest }: { label: string; icon?: React.ReactNode; trailing?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="relative mt-1.5">
        {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
        <input
          {...rest}
          className={`w-full h-11 ${icon ? "pl-10" : "pl-4"} ${trailing ? "pr-10" : "pr-4"} rounded-xl bg-card border border-input text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all`}
        />
        {trailing && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{trailing}</div>}
      </div>
    </label>
  );
}
