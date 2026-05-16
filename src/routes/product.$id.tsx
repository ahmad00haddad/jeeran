import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Star, Truck, ShieldCheck, RotateCcw, Minus, Plus } from "lucide-react";
import { TopBar } from "@/components/jeeran/TopBar";
import { Header } from "@/components/jeeran/Header";
import { Footer } from "@/components/jeeran/Footer";
import { MobileNav } from "@/components/jeeran/MobileNav";
import { ProductCard } from "@/components/jeeran/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { resolveImg } from "@/lib/imageMap";
import { useCart } from "@/store/cart";
import type { DBProduct } from "@/types/db";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({ component: PDP });

function PDP() {
  const { id } = useParams({ from: "/product/$id" });
  const [p, setP] = useState<DBProduct | null>(null);
  const [related, setRelated] = useState<DBProduct[]>([]);
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const { add, toggleWish, wishlist } = useCart();

  useEffect(() => {
    supabase.from("products").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      setP(data as DBProduct);
      if (data?.category_id) {
        const nowIso = new Date().toISOString();
        supabase.from("products").select("*").eq("category_id", data.category_id).neq("id", id).eq("sold", false).or(`reserved_until.is.null,reserved_until.lt.${nowIso}`).limit(4)
          .then(({ data: r }) => setRelated((r as DBProduct[]) || []));
      }
    });
  }, [id]);

  if (!p) return <div className="min-h-screen flex items-center justify-center">جارٍ التحميل...</div>;
  const effective = p.sale_price ?? p.price;
  const sizes = Array.isArray(p.sizes) ? p.sizes : ["S", "M", "L", "XL"];
  const wished = wishlist.includes(p.id);
  const reservedUntil = (p as any).reserved_until ? new Date((p as any).reserved_until) : null;
  const isReserved = !!(reservedUntil && reservedUntil.getTime() > Date.now());
  const isSold = (p as any).sold === true;
  const unavailable = isSold || isReserved;

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <TopBar />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">الرئيسية</Link> ← <Link to="/shop" className="hover:text-primary">المتجر</Link> ← <span>{p.name_ar}</span>
        </nav>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-secondary aspect-[4/5] overflow-hidden">
            <img src={resolveImg(p.image_url)} alt={p.name_ar} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-5">
            {p.badge && <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1">{p.badge}</span>}
            <h1 className="font-display text-3xl md:text-4xl font-bold">{p.name_ar}</h1>
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 fill-gold text-gold" />
              <span className="font-bold">{(p.rating ?? 4.8).toFixed(1)}</span>
              <span className="text-muted-foreground">({p.reviews_count ?? 0} تقييم)</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-primary font-bold text-4xl">{effective.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">د.أ</span>
              {p.sale_price && <span className="text-lg text-muted-foreground line-through">{p.price.toFixed(2)}</span>}
            </div>
            <p className="text-muted-foreground leading-relaxed">{p.description_ar}</p>

            <div>
              <div className="text-sm font-bold mb-2">المقاس:</div>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((s: string) => (
                  <button key={s} onClick={() => setSize(s)} className={`w-12 h-12 border ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{s}</button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2"><Minus className="w-4 h-4" /></button>
                <span className="px-4 font-bold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-2"><Plus className="w-4 h-4" /></button>
              </div>
              <button
                disabled={unavailable}
                onClick={() => {
                  if (unavailable) return;
                  add({ id: p.id, name_ar: p.name_ar, price: effective, image_url: p.image_url, size, quantity: qty });
                  toast.success("انضافت للسلة 🛍️");
                }}
                className="flex-1 bg-primary text-primary-foreground py-3.5 font-bold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >{isSold ? "تم البيع" : isReserved ? "محجوزة حالياً" : "أضيفي للسلة"}</button>
              <button onClick={() => toggleWish(p.id)} className={`p-3 border ${wished ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                <Heart className={`w-5 h-5 ${wished ? "fill-current" : ""}`} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border text-xs">
              <div className="flex flex-col items-center gap-1 text-center"><Truck className="w-5 h-5 text-primary" /> شحن لكل الأردن</div>
              <div className="flex flex-col items-center gap-1 text-center"><ShieldCheck className="w-5 h-5 text-primary" /> دفع عند الاستلام</div>
              <div className="flex flex-col items-center gap-1 text-center"><RotateCcw className="w-5 h-5 text-primary" /> استبدال ١٤ يوم</div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-6">قطع تكمّل إطلالتك</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
              {related.map((r) => <ProductCard key={r.id} p={r} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
