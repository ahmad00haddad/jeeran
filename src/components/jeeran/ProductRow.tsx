import { ProductCard } from "./ProductCard";
import type { DBProduct } from "@/types/db";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function ProductRow({ title, subtitle, items = [], viewAllHref = "/shop" }: { title: string; subtitle?: string; items?: DBProduct[]; viewAllHref?: string }) {
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <Reveal>
          <SectionHeading
            title={title}
            subtitle={subtitle}
            action={
              <Link
                to={viewAllHref}
                search={{}}
                className="shrink-0 text-primary text-sm font-bold pb-1 border-b border-gold/50 hover:border-primary transition-colors"
              >
                شوفي الكل ←
              </Link>
            }
          />
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {items.map((p, i) => (
            <div key={p.id} {...(i === 0 ? { "data-tour": "product" } : {})}>
              <Reveal as="div" delay={Math.min(i, 7) * 60}>
                <ProductCard p={p} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
