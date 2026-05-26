export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-9 w-9 rounded-xl bg-primary grid place-items-center shadow-soft">
        <span className="font-display font-bold text-gold text-lg leading-none">M</span>
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-gold ring-2 ring-background" />
      </div>
      <div className="leading-tight">
        <div className="font-display font-semibold text-foreground tracking-tight">Matt Group</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Sénégal</div>
      </div>
    </div>
  );
}
