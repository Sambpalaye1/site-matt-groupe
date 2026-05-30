import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone, User } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/assurance", label: "Assurance" },
  { to: "/vtc", label: "VTC" },
  { to: "/location", label: "Location" },
  { to: "/verse-auto", label: "Verse Auto" },
  { to: "/billetterie", label: "Billetterie" },
  { to: "/support", label: "Support" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "glass shadow-soft" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/"><Logo /></Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to as any}
                className="px-3 py-2 text-sm font-medium text-foreground/75 hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                activeProps={{ className: "text-foreground bg-muted" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <a
              href="tel:+221779746315"
              className="flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4 text-gold" />
              <span>77 974 63 15</span>
            </a>
            <Link to="/login">
              <Button variant="hero" size="sm" className="flex items-center gap-2 rounded-xl">
                <User className="h-4 w-4" />
                Espace Client
              </Button>
            </Link>
          </div>

          <button
            className="lg:hidden h-10 w-10 grid place-items-center rounded-lg hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden pb-4 space-y-1 animate-fade-up">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to as any}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border space-y-3">
              <a
                href="tel:+221779746315"
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 text-gold" />
                <span>77 974 63 15</span>
              </a>
              <Link to="/login" className="block w-full" onClick={() => setOpen(false)}>
                <Button variant="hero" className="w-full flex items-center justify-center gap-2 rounded-xl">
                  <User className="h-4 w-4" />
                  Espace Client
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
