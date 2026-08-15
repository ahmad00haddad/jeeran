/** Rotating circular gold stamp — marks a one-of-a-kind piece (editorial detail). */
export function UniqueStamp({ className = "", size = 104 }: { className?: string; size?: number }) {
  const text = "قطعة وحيدة • ما في منها ثانية • جيران • ";
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div className="relative w-full h-full rounded-full bg-deep/85 backdrop-blur-sm hairline-gold flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-spin-slow">
          <defs>
            <path id="stamp-circle" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
          </defs>
          <text fill="var(--color-gold)" fontSize="9.5" fontWeight="700" letterSpacing="0.5">
            <textPath href="#stamp-circle" startOffset="0%">{text}</textPath>
          </text>
        </svg>
        <span className="text-gold text-lg font-serif-ar leading-none">١</span>
      </div>
    </div>
  );
}
