export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        {/* Arche gauche - Bleu */}
        <path d="M4 20V9.5C4 6.5 6.5 4.5 9 7.5L12 11" stroke="#0066FF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Arche droite - Orange */}
        <path d="M20 20V9.5C20 6.5 17.5 4.5 15 7.5L12 11" stroke="#FF8C00" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div className="leading-tight select-none">
        <div className={`font-display font-extrabold text-lg tracking-tight transition-colors ${light ? "text-white" : "text-foreground"}`}>
          MATT
        </div>
        <div className={`text-[9px] font-bold tracking-[0.22em] uppercase transition-colors ${light ? "text-white/60" : "text-muted-foreground"}`}>
          GROUP CORP
        </div>
      </div>
    </div>
  );
}
