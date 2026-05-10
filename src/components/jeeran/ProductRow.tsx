import { ProductCard } from "./ProductCard";
import type { DBProduct } from "@/types/db";
import { Link } from "@tanstack/react-router";

export function ProductRow({ title, subtitle, items = [], viewAllHref = "/shop" }: { title: string; subtitle?: string; items?: DBProduct[]; viewAllHref?: string }) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">{title}</h2>
            {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
          </div>
          <Link to={viewAllHref} className="text-primary text-sm font-bold hover:underline">شوفي الكل ←</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}
