import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Truck, ShieldCheck, RotateCcw, Minus, Plus, BadgeCheck, MessageCircle, Tag, Clock, Eye, Sparkles } from "lucide-react";
import { TopBar } from "@/components/jeeran/TopBar";
import { Header } from "@/components/jeeran/Header";
import { Footer } from "@/components/jeeran/Footer";
import { MobileNav } from "@/components/jeeran/MobileNav";
import { ProductCard } from "@/components/jeeran/ProductCard";
import { OfferDialog } from "@/components/jeeran/OfferDialog";
import { RentalDialog } from "@/components/jeeran/RentalDialog";
import { supabase } from "@/integrations/supabase/client";
import { resolveImg } from "@/lib/imageMap";
import { useCart } from "@/store/cart";
import { whatsappLink } from "@/lib/config";
import type { DBProduct } from "@/types/db";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({ component: PDP });

function PDP() {
  const { id } = useParams({ from: "/product/$id" });
  const [p, setP] = useState<DBProduct | null>(null);
  const [related, setRelated] = useState<DBProduct[]>([]);
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [dialog, setDialog] = useState<null | "offer" | "hold24h">(null);
  const [rentOpen, setRentOpen] = useState(false);
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
    supabase.rpc("increment_product_view", { _product_id: id });
  }, [id]);

  if (!p) return <div className="min-h-screen flex items-center justify-center">جارٍ التحميل...</div>;
  const effective = p.sale_price ?? p.price;
  const sizes = Array.isArray(p.sizes) ? p.sizes : ["S", "M", "L", "XL"];
  const wished = wishlist.includes(p.id);
  const reservedUntil = (p as any).reserved_until ? new Date((p as any).reserved_until) : null;
  const isReserved = !!(reservedUntil && reservedUntil.getTime() > Date.now());
  const isSold = (p as any).sold === true;
  const unavailable = isSold || isReserved;
  const verified = (p as any).verified_clean === true;
  const viewsToday = Number((p as any).views_today ?? 0);
  const rentable = (p as any).rentable === true && Number((p as any).rental_price ?? 0) > 0;
  const rentalPrice = Number((p as any).rental_price ?? 0);
  const rentalDays = (p as any).rental_duration_days as number | null;
  const rentalDeposit = (p as any).rental_deposit as number | null;

  const waMsg = `مرحبا 👋\nبستفسر عن قطعة: *${p.name_ar}*\nالسعر: ${effective.toFixed(2)} د.أ\nرابط: ${typeof window !== "undefined" ? window.location.href : ""}`;

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <TopBar />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">الرئيسية</Link> ← <Link to="/shop" className="hover:text-primary">المتجر</Link> ← <span>{p.name_ar}</span>
        </nav>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-secondary aspect-[4/5] overflow-hidden relative">
            <img src={resolveImg(p.image_url)} alt={p.name_ar} className="w-full h-full object-cover" />
            {verified && (
              <span className="absolute top-3 right-3 bg-green-700 text-white text-xs font-bold px-2.5 py-1 flex items-center gap-1 shadow">
                <BadgeCheck className="w-4 h-4" /> موثّقة نظيفة
              </span>
            )}
          </div>
          <div className="space-y-5">
            <div className="flex items-center gap-2 flex-wrap">
              {p.badge && <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1">{p.badge}</span>}
              {verified && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-800 text-xs font-bold px-2 py-1 border border-green-200">
                  <BadgeCheck className="w-3.5 h-3.5" /> موثّقة نظيفة
                </span>
              )}
              {viewsToday > 0 && (
                <span className="inline-flex items-center gap-1 bg-secondary text-foreground text-xs px-2 py-1">
                  <Eye className="w-3.5 h-3.5" /> شُفت {viewsToday} مرة اليوم
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">{p.name_ar}</h1>
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

            {!unavailable && (
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={whatsappLink(waMsg)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-green-600 text-white py-2.5 text-sm font-bold hover:bg-green-700 transition"
                >
                  <MessageCircle className="w-4 h-4" /> واتساب
                </a>
                <button
                  onClick={() => setDialog("offer")}
                  className="flex items-center justify-center gap-1.5 bg-gold text-gold-foreground py-2.5 text-sm font-bold hover:opacity-90 transition"
                >
                  <Tag className="w-4 h-4" /> اعرضي سعر
                </button>
                <button
                  onClick={() => setDialog("hold24h")}
                  className="flex items-center justify-center gap-1.5 bg-deep text-cream py-2.5 text-sm font-bold hover:opacity-90 transition"
                >
                  <Clock className="w-4 h-4" /> احجزيها 24س
                </button>
              </div>
            )}

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
      <OfferDialog
        open={!!dialog}
        onClose={() => setDialog(null)}
        productId={p.id}
        productName={p.name_ar}
        type={dialog || "offer"}
        currentPrice={effective}
      />
      <Footer />
      <MobileNav />
    </div>
  );
}
