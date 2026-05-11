import { Heart, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { DBProduct } from "@/types/db";
import { resolveImg } from "@/lib/imageMap";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

const CONDITION_LABEL: Record<string, string> = {
  new: "جديد بالعلاقة",
  like_new: "كالجديد",
  worn_once: "ملبوس مرة",
  gently_used: "بحالة ممتازة",
};

export function ProductCard({ p }: { p: DBProduct & { brand?: string | null; condition?: string | null; original_price?: number | null } }) {
  const price = Number(p.price);
  const sale = p.sale_price ? Number(p.sale_price) : undefined;
  const original = p.original_price ? Number(p.original_price) : undefined;
  const effective = sale ?? price;
  const compareTo = original ?? (sale ? price : undefined);
  const discount = compareTo ? Math.round(((compareTo - effective) / compareTo) * 100) : 0;
  const { add, toggleWish, wishlist } = useCart();
  const wished = wishlist.includes(p.id);
  const img = resolveImg(p.image_url);
  const condLabel = p.condition ? CONDITION_LABEL[p.condition] : null;

  return (
    <article className="group relative bg-card border border-border/60 overflow-hidden">
      <Link to="/product/$id" params={{ id: p.id }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
          <img src={img} alt={p.name_ar} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {condLabel && (
            <span className="absolute top-2 right-2 bg-deep/85 text-cream text-[10px] font-bold px-2 py-1">{condLabel}</span>
          )}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-gold text-gold-foreground text-[10px] font-bold px-2 py-1">-{discount}٪</span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); toggleWish(p.id); }}
            className={`absolute bottom-2 left-2 w-8 h-8 rounded-full flex items-center justify-center transition ${wished ? "bg-primary text-primary-foreground" : "bg-cream/90 backdrop-blur hover:bg-primary hover:text-primary-foreground"}`}
            aria-label="wishlist"
          >
            <Heart className={`w-4 h-4 ${wished ? "fill-current" : ""}`} />
          </button>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          add({ id: p.id, name_ar: p.name_ar, price: effective, image_url: p.image_url, quantity: 1 });
          toast.success("انضافت للسلة 🛍️", { description: p.name_ar });
        }}
        className="w-full bg-primary text-primary-foreground py-2 text-xs font-bold tracking-wider hover:bg-deep transition"
      >
        أضف للسلة +
      </button>
      <div className="p-3 space-y-1">
        {p.brand && <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{p.brand}</div>}
        <h3 className="text-sm leading-snug line-clamp-2 min-h-[2.5rem]">{p.name_ar}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="w-3 h-3 fill-gold text-gold" />
          <span className="font-medium">{(p.rating ?? 4.8).toFixed(1)}</span>
          <span>({p.reviews_count ?? 0})</span>
        </div>
        <div className="flex items-baseline gap-2 pt-1 flex-wrap">
          <span className="text-primary font-bold text-lg">{effective.toFixed(2)}</span>
          <span className="text-[11px] text-muted-foreground">د.أ</span>
          {compareTo && <span className="text-xs text-muted-foreground line-through">{compareTo.toFixed(2)}</span>}
        </div>
      </div>
    </article>
  );
}
