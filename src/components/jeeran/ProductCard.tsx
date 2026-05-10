import { Heart, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { DBProduct } from "@/types/db";
import { resolveImg } from "@/lib/imageMap";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

export function ProductCard({ p }: { p: DBProduct }) {
  const price = p.price;
  const sale = p.sale_price ?? undefined;
  const discount = sale ? Math.round(((price - sale) / price) * 100) : 0;
  const effective = sale ?? price;
  const { add, toggleWish, wishlist } = useCart();
  const wished = wishlist.includes(p.id);
  const img = resolveImg(p.image_url);

  return (
    <article className="group relative bg-card border border-border/60 overflow-hidden">
      <Link to="/product/$id" params={{ id: p.id }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
          <img src={img} alt={p.name_ar} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {p.badge && (
            <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 tracking-wide">{p.badge}</span>
          )}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-gold text-gold-foreground text-[10px] font-bold px-2 py-1">-{discount}٪</span>
          )}
        </div>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); toggleWish(p.id); }}
        className={`absolute bottom-[7.2rem] left-3 w-9 h-9 rounded-full flex items-center justify-center transition ${wished ? "bg-primary text-primary-foreground" : "bg-cream/90 backdrop-blur hover:bg-primary hover:text-primary-foreground"}`}
        aria-label="wishlist"
      >
        <Heart className={`w-4 h-4 ${wished ? "fill-current" : ""}`} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          add({ id: p.id, name_ar: p.name_ar, price: effective, image_url: p.image_url, quantity: 1 });
          toast.success("انضافت للسلة 🛍️", { description: p.name_ar });
        }}
        className="absolute top-[60%] inset-x-0 bg-deep text-cream py-2.5 text-xs font-bold tracking-wider translate-y-full group-hover:translate-y-0 transition-transform"
      >
        أضف للسلة +
      </button>
      <div className="p-3 space-y-1.5">
        <h3 className="text-sm leading-snug line-clamp-2 min-h-[2.5rem]">{p.name_ar}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="w-3 h-3 fill-gold text-gold" />
          <span className="font-medium">{(p.rating ?? 4.8).toFixed(1)}</span>
          <span>({p.reviews_count ?? 0})</span>
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-primary font-bold text-lg">{effective.toFixed(2)}</span>
          <span className="text-[11px] text-muted-foreground">د.أ</span>
          {sale && <span className="text-xs text-muted-foreground line-through">{price.toFixed(2)}</span>}
        </div>
      </div>
    </article>
  );
}
