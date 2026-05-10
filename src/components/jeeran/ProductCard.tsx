import { Heart, Star } from "lucide-react";
import type { Product } from "./products";

export function ProductCard({ p }: { p: Product }) {
  const discount = p.sale ? Math.round(((p.price - p.sale) / p.price) * 100) : 0;
  return (
    <article className="group relative bg-card border border-border/60 overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {p.badge && (
          <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 tracking-wide">
            {p.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-gold text-gold-foreground text-[10px] font-bold px-2 py-1">
            -{discount}٪
          </span>
        )}
        <button className="absolute bottom-3 left-3 w-9 h-9 bg-cream/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition">
          <Heart className="w-4 h-4" />
        </button>
        <button className="absolute bottom-0 inset-x-0 bg-deep text-cream py-2.5 text-xs font-bold tracking-wider translate-y-full group-hover:translate-y-0 transition-transform">
          أضف للسلة +
        </button>
      </div>
      <div className="p-3 space-y-1.5">
        <h3 className="text-sm leading-snug line-clamp-2 min-h-[2.5rem]">{p.name}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="w-3 h-3 fill-gold text-gold" />
          <span className="font-medium">{p.rating}</span>
          <span>({p.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-primary font-bold text-lg">{(p.sale ?? p.price).toFixed(2)}</span>
          <span className="text-[11px] text-muted-foreground">د.أ</span>
          {p.sale && (
            <span className="text-xs text-muted-foreground line-through">{p.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
