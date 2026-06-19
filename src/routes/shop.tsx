import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/jeeran/TopBar";
import { Header } from "@/components/jeeran/Header";
import { Footer } from "@/components/jeeran/Footer";
import { MobileNav } from "@/components/jeeran/MobileNav";
import { ProductCard } from "@/components/jeeran/ProductCard";
import { ProductGridSkeleton } from "@/components/jeeran/Skeletons";
import { supabase } from "@/integrations/supabase/client";
import type { DBProduct, Category } from "@/types/db";

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>) => ({ q: (s.q as string) || "", sort: (s.sort as string) || "new" }),
  component: ShopPage,
  head: () => ({ meta: [{ title: "تسوّقي — جيران" }, { name: "description", content: "تشكيلة جيران الكاملة من الملابس المحتشمة" }] }),
});

function ShopPage() {
  const { q, sort } = useSearch({ from: "/shop" });
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [cats, setCats] = useState<Category[]>([]);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [onSale, setOnSale] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    supabase.from("categories").select("*").order("display_order").then(({ data }) => setCats((data as Category[]) || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const nowIso = new Date().toISOString();
    let query = supabase.from("products").select("*").eq("active", true).eq("sold", false).or(`reserved_until.is.null,reserved_until.lt.${nowIso}`);
    if (activeCat) query = query.eq("category_id", activeCat);
    if (q) query = query.ilike("name_ar", `%${q}%`);
    if (onSale) query = query.not("sale_price", "is", null);
    if (maxPrice) query = query.lte("price", maxPrice);
    if (verifiedOnly) query = query.eq("verified_clean", true);
    if (sort === "price_asc") query = query.order("price", { ascending: true });
    else if (sort === "price_desc") query = query.order("price", { ascending: false });
    else query = query.order("created_at", { ascending: false });
    query.limit(200).then(({ data }) => { setProducts((data as DBProduct[]) || []); setLoading(false); });
  }, [activeCat, q, sort, onSale, maxPrice, verifiedOnly]);

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <TopBar />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="font-display text-3xl font-bold mb-4">{q ? `نتائج: ${q}` : "كل التشكيلة"}</h1>
        <div className="flex flex-wrap gap-2 mb-3">
          <button onClick={() => setActiveCat(null)} className={`px-4 py-1.5 text-sm border ${!activeCat ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>الكل</button>
          {cats.map((c) => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} className={`px-4 py-1.5 text-sm border ${activeCat === c.id ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>{c.name_ar}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-6 pt-2 border-t border-border">
          <button onClick={() => setMaxPrice(maxPrice === 5 ? null : 5)} className={`px-3 py-1.5 text-xs font-bold border ${maxPrice === 5 ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>تحت 5 د.أ</button>
          <button onClick={() => setMaxPrice(maxPrice === 10 ? null : 10)} className={`px-3 py-1.5 text-xs font-bold border ${maxPrice === 10 ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>تحت 10 د.أ</button>
          <button onClick={() => setMaxPrice(maxPrice === 20 ? null : 20)} className={`px-3 py-1.5 text-xs font-bold border ${maxPrice === 20 ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>تحت 20 د.أ</button>
          <button onClick={() => setVerifiedOnly(!verifiedOnly)} className={`px-3 py-1.5 text-xs font-bold border ${verifiedOnly ? "bg-green-700 text-white border-green-700" : "border-border"}`}>✓ موثّقة نظيفة</button>
          <button onClick={() => setOnSale(!onSale)} className={`px-3 py-1.5 text-xs font-bold border ${onSale ? "bg-gold text-gold-foreground border-gold" : "border-border"}`}>تخفيضات فقط</button>
        </div>
        <div className="text-sm text-muted-foreground mb-4">{loading ? "جارٍ تحميل القطع..." : `${products.length} منتج`}</div>
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg mb-2">ما لقينا قطع تطابق فلترك 🔍</p>
            <p className="text-sm">جرّبي تخفّفي الفلاتر أو تبحثي بكلمة تانية</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
