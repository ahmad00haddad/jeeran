import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Truck, ShieldCheck, RotateCcw, BadgeCheck, MessageCircle, Tag, Clock, Eye, Sparkles } from "lucide-react";
import { TopBar } from "@/components/jeeran/TopBar";
import { Header } from "@/components/jeeran/Header";
import { Footer } from "@/components/jeeran/Footer";
import { MobileNav } from "@/components/jeeran/MobileNav";
import { ProductCard } from "@/components/jeeran/ProductCard";
import { OfferDialog } from "@/components/jeeran/OfferDialog";
import { ProductDetailSkeleton } from "@/components/jeeran/Skeletons";
import { RentalDialog } from "@/components/jeeran/RentalDialog";
import { supabase } from "@/integrations/supabase/client";
import { resolveImg } from "@/lib/imageMap";
import { useCart } from "@/store/cart";
import { whatsappLink } from "@/lib/config";
import type { DBProduct } from "@/types/db";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  component: PDP,
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("products")
      .select("id,name_ar,description_ar,price,sale_price,image_url,sold")
      .eq("id", params.id)
      .maybeSingle();
    return { seo: data as Pick<DBProduct, "id" | "name_ar" | "description_ar" | "price" | "sale_price" | "image_url" | "sold"> | null };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.seo;
    if (!p) {
      return { meta: [{ title: "قطعة غير متوفرة — جيران" }] };
    }
    const price = (p.sale_price ?? p.price).toFixed(2);
    const title = `${p.name_ar} — ${price} د.أ | جيران`;
    const desc = (p.description_ar || `قطعة فريدة من جيران: ${p.name_ar}. السعر ${price} د.أ. الدفع عند الاستلام.`).slice(0, 160);
    const img = p.image_url?.startsWith("http") ? p.image_url : `https://jeeran.lovable.app${p.image_url || ""}`;
    const url = `https://jeeran.lovable.app/product/${params.id}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { property: "og:image", content: img },
        { property: "product:price:amount", content: price },
        { property: "product:price:currency", content: "JOD" },
        { property: "product:availability", content: p.sold ? "oos" : "instock" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: img },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name_ar,
          description: desc,
          image: img,
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: "JOD",
            availability: p.sold ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            url,
          },
        }),
      }],
    };
  },
});

function PDP() {
  const { id } = useParams({ from: "/product/$id" });
  const [p, setP] = useState<DBProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [related, setRelated] = useState<DBProduct[]>([]);
  // قطعة واحدة فريدة — لا مقاسات متعددة
  const [dialog, setDialog] = useState<null | "offer" | "hold24h">(null);

  const [rentOpen, setRentOpen] = useState(false);
  const { add, toggleWish, wishlist } = useCart();

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    supabase.from("products").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      setLoading(false);
      if (!data) { setNotFound(true); return; }
      setP(data as DBProduct);
      if (data?.category_id) {
        const nowIso = new Date().toISOString();
        supabase.from("products").select("*").eq("category_id", data.category_id).neq("id", id).eq("sold", false).or(`reserved_until.is.null,reserved_until.lt.${nowIso}`).limit(4)
          .then(({ data: r }) => setRelated((r as DBProduct[]) || []));
      }
    });
    // Debounce view counter: count once per product per 30 minutes per browser
    try {
      const k = `jeeran_view_${id}`;
      const last = Number(sessionStorage.getItem(k) || "0");
      const now = Date.now();
      if (now - last > 30 * 60 * 1000) {
        sessionStorage.setItem(k, String(now));
        supabase.rpc("increment_product_view", { _product_id: id });
      }
    } catch {
      supabase.rpc("increment_product_view", { _product_id: id });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pb-16 md:pb-0">
        <TopBar />
        <Header />
        <ProductDetailSkeleton />
        <Footer />
        <MobileNav />
      </div>
    );
  }
  if (notFound || !p) {
    return (
      <div className="min-h-screen pb-16 md:pb-0">
        <TopBar />
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="font-display text-4xl font-bold mb-3">القطعة مش موجودة</div>
          <p className="text-muted-foreground mb-6">يمكن انباعت أو الرابط مش صحيح. تعالي شوفي باقي التشكيلة 💛</p>
          <Link to="/shop" className="inline-block bg-primary text-primary-foreground px-8 py-3 font-bold hover:bg-primary/90 transition">رجوع للمتجر</Link>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }
  const effective = p.sale_price ?? p.price;
  // قطعة فريدة — لا مقاسات
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
    <div className="min-h-screen pb-32 md:pb-0">
      <TopBar />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        <nav className="text-xs text-muted-foreground mb-4 hidden md:block">
          <Link to="/" className="hover:text-primary">الرئيسية</Link> ← <Link to="/shop" className="hover:text-primary">المتجر</Link> ← <span>{p.name_ar}</span>
        </nav>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-secondary aspect-[4/5] overflow-hidden relative -mx-4 md:mx-0">
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

            {rentable && !unavailable && (
              <div className="border-2 border-gold bg-gold/5 p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-deep">
                  <Sparkles className="w-4 h-4 text-gold" /> متوفرة للإيجار كمان!
                </div>
                <div className="text-sm text-muted-foreground">
                  استأجريها لمناسبتك بـ <strong className="text-primary text-base">{rentalPrice.toFixed(2)} د.أ</strong>
                  {rentalDays ? ` لمدة ${rentalDays} ${rentalDays === 1 ? "يوم" : "أيام"}` : ""}
                  {rentalDeposit ? ` + تأمين ${rentalDeposit.toFixed(2)} د.أ (مسترد)` : ""}
                </div>
                <button onClick={() => setRentOpen(true)} className="w-full bg-gold text-gold-foreground py-2.5 font-bold hover:opacity-90 transition flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" /> استأجريها لمناسبتك
                </button>
              </div>
            )}

            <div className="bg-secondary/60 border border-border px-3 py-2 text-xs text-muted-foreground">
              قطعة واحدة فريدة — مقاس واحد فقط كما هو موصوف. راجعي تفاصيل القياسات في الوصف.
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                disabled={unavailable}
                onClick={() => {
                  if (unavailable) return;
                  add({ id: p.id, name_ar: p.name_ar, price: effective, image_url: p.image_url, quantity: 1 });
                  toast.success("انضافت للسلة 🛍️");
                }}
                className="flex-1 bg-primary text-primary-foreground py-3.5 font-bold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed tap"
              >{isSold ? "تم البيع" : isReserved ? "محجوزة حالياً" : "أضيفي للسلة"}</button>

              <button onClick={() => toggleWish(p.id)} className={`p-3 border tap ${wished ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
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
      <RentalDialog
        open={rentOpen}
        onClose={() => setRentOpen(false)}
        productId={p.id}
        productName={p.name_ar}
        rentalPrice={rentalPrice}
        rentalDays={rentalDays}
        rentalDeposit={rentalDeposit}
      />
      <Footer />
      <MobileNav />
    </div>
  );
}
