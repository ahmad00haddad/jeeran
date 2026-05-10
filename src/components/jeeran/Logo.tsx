export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className="font-display text-3xl md:text-4xl font-bold tracking-tight">
        جيران
      </span>
      <span className="text-[10px] tracking-[0.3em] text-gold uppercase font-medium">
        JEERAN
      </span>
    </div>
  );
}
