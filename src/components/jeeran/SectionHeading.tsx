import { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  align = "start",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  action?: ReactNode;
  align?: "start" | "center";
}) {
  const centered = align === "center";
  return (
    <div className={`mb-8 md:mb-10 flex gap-4 ${centered ? "flex-col items-center text-center" : "items-end justify-between"}`}>
      <div className={centered ? "max-w-2xl" : ""}>
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h2 className="type-h2 font-display">{title}</h2>
        {subtitle && <p className="text-muted-foreground text-sm md:text-base mt-2 leading-relaxed">{subtitle}</p>}
        {centered && <div className="rule-gold mx-auto mt-5" />}
      </div>
      {action}
    </div>
  );
}
