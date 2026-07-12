import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";
import { TopBar } from "@/components/jeeran/TopBar";
import { Header } from "@/components/jeeran/Header";
import { Footer } from "@/components/jeeran/Footer";
import { MobileNav } from "@/components/jeeran/MobileNav";
import { ProductCard } from "@/components/jeeran/ProductCard";
import { ProductGridSkeleton, ProductCardSkeleton } from "@/components/jeeran/Skeletons";
import { BottomSheet } from "@/components/mobile/BottomSheet";
import { supabase } from "@/integrations/supabase/client";
import type { DBProduct, Category } from "@/types/db";


const PAGE_SIZE = 24;

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>) => ({ q: (s.q as string) || "", sort: (s.sort as string) || "new" }),
  component: ShopPage,
  head: () => ({ meta: [{ title: "تسوّقي — جيران" }, { name: "description", content: "تشكيلة جيران الكاملة من الملابس المحتشمة" }] }),
});

function ShopPage() {
  const { q, sort } = useSearch({ from: "/shop" });
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [cats, setCats] = useState<Category[]>([]);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [onSale, setOnSale] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(0);


  useEffect(() => {
    supabase.from("categories").select("*").order("display_order").then(({ data }) => setCats((data as Category[]) || []));
  }, []);

  const buildQuery = useCallback(() => {
    const nowIso = new Date().toISOString();
    let query = supabase.from("products").select("*", { count: "exact" }).eq("active", true).eq("sold", false).or(`reserved_until.is.null,reserved_until.lt.${nowIso}`);
    if (activeCat) query = query.eq("category_id", activeCat);
    if (q) query = query.ilike("name_ar", `%${q}%`);
    if (onSale) query = query.not("sale_price", "is", null);
    if (maxPrice) query = query.lte("price", maxPrice);
    if (verifiedOnly) query = query.eq("verified_clean", true);
    if (sort === "price_asc") query = query.order("price", { ascending: true });
    else if (sort === "price_desc") query = query.order("price", { ascending: false });
    else query = query.order("created_at", { ascending: false });
    return query;
  }, [activeCat, q, sort, onSale, maxPrice, verifiedOnly]);

  useEffect(() => {
    setLoading(true);
    setProducts([]);
    setHasMore(true);
    pageRef.current = 0;
    buildQuery().range(0, PAGE_SIZE - 1).then(({ data, count }) => {
      const items = (data as DBProduct[]) || [];
      setProducts(items);
      setTotal(count || 0);
      setHasMore(items.length === PAGE_SIZE && (count == null || items.length < count));
      setLoading(false);
    });
  }, [buildQuery]);

  const loadMore = useCallback(async () => {
    if (loadingMore || loading || !hasMore) return;
    setLoadingMore(true);
    const next = pageRef.current + 1;
    const from = next * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, count } = await buildQuery().range(from, to);
    const items = (data as DBProduct[]) || [];
    setProducts((prev) => [...prev, ...items]);
    pageRef.current = next;
    if (count != null) setTotal(count);
    setHasMore(items.length === PAGE_SIZE && (count == null || from + items.length < count));
    setLoadingMore(false);
  }, [buildQuery, hasMore, loading, loadingMore]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) loadMore();
    }, { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <TopBar />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-3 md:mb-4">{q ? `نتائج: ${q}` : "كل التشكيلة"}</h1>

        {/* Sticky filter chips (categories) — horizontally scrollable on mobile */}
        <div className="sticky top-14 md:top-0 z-20 -mx-4 px-4 py-2 bg-cream/95 backdrop-blur border-b border-border">
          <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x">
            <button onClick={() => setActiveCat(null)} className={`shrink-0 snap-start px-4 py-1.5 text-sm rounded-full border tap ${!activeCat ? "bg-primary text-primary-foreground border-primary" : "border-border bg-cream"}`}>الكل</button>
            {cats.map((c) => (
              <button key={c.id} onClick={() => setActiveCat(c.id)} className={`shrink-0 snap-start px-4 py-1.5 text-sm rounded-full border tap ${activeCat === c.id ? "bg-primary text-primary-foreground border-primary" : "border-border bg-cream"}`}>{c.name_ar}</button>
            ))}
          </div>
        </div>

        {/* Desktop-only inline filters */}
        <div className="hidden md:flex flex-wrap gap-2 my-4">
          <button onClick={() => setMaxPrice(maxPrice === 5 ? null : 5)} className={`px-3 py-1.5 text-xs font-bold border ${maxPrice === 5 ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>تحت 5 د.أ</button>
          <button onClick={() => setMaxPrice(maxPrice === 10 ? null : 10)} className={`px-3 py-1.5 text-xs font-bold border ${maxPrice === 10 ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>تحت 10 د.أ</button>
          <button onClick={() => setMaxPrice(maxPrice === 20 ? null : 20)} className={`px-3 py-1.5 text-xs font-bold border ${maxPrice === 20 ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>تحت 20 د.أ</button>
          <button onClick={() => setVerifiedOnly(!verifiedOnly)} className={`px-3 py-1.5 text-xs font-bold border ${verifiedOnly ? "bg-green-700 text-white border-green-700" : "border-border"}`}>✓ موثّقة نظيفة</button>
          <button onClick={() => setOnSale(!onSale)} className={`px-3 py-1.5 text-xs font-bold border ${onSale ? "bg-gold text-gold-foreground border-gold" : "border-border"}`}>تخفيضات فقط</button>
        </div>

        {/* Mobile filter trigger */}
        <div className="md:hidden flex items-center justify-between mt-3 mb-2">
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-cream text-sm font-bold tap"
          >
            <SlidersHorizontal className="w-4 h-4" /> فلاتر
            {(maxPrice || verifiedOnly || onSale) && (
              <span className="bg-primary text-primary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {[maxPrice, verifiedOnly, onSale].filter(Boolean).length}
              </span>
            )}
          </button>
          <div className="text-xs text-muted-foreground">
            {loading ? "جارٍ التحميل..." : `${products.length}${total ? `/${total}` : ""}`}
          </div>
        </div>

        <div className="hidden md:block text-sm text-muted-foreground mb-4">
          {loading ? "جارٍ تحميل القطع..." : `${products.length}${total ? ` من ${total}` : ""} منتج`}
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg mb-2">ما لقينا قطع تطابق فلترك 🔍</p>
            <p className="text-sm">جرّبي تخفّفي الفلاتر أو تبحثي بكلمة تانية</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
              {loadingMore && Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={`s-${i}`} />)}
            </div>
            <div ref={sentinelRef} className="h-10" />
            {!hasMore && products.length > PAGE_SIZE && (
              <div className="text-center text-xs text-muted-foreground py-6">وصلتي لآخر القطع 💛</div>
            )}
          </>
        )}
      </main>
      <Footer />
      <MobileNav />

      <BottomSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="فلاتر البحث"
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => { setMaxPrice(null); setVerifiedOnly(false); setOnSale(false); }}
              className="flex-1 py-3 border border-border rounded-full font-bold text-sm tap"
            >مسح الفلاتر</button>
            <button
              onClick={() => setFiltersOpen(false)}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm tap"
            >عرض النتائج</button>
          </div>
        }
      >
        <div className="p-4 space-y-6">
          <section>
            <h3 className="font-bold mb-3 text-sm">السعر</h3>
            <div className="flex flex-wrap gap-2">
              {[5, 10, 20].map((v) => (
                <button
                  key={v}
                  onClick={() => setMaxPrice(maxPrice === v ? null : v)}
                  className={`px-4 py-2 text-sm rounded-full border tap ${maxPrice === v ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}
                >تحت {v} د.أ</button>
              ))}
            </div>
          </section>
          <section>
            <h3 className="font-bold mb-3 text-sm">الحالة</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`px-4 py-2 text-sm rounded-full border tap ${verifiedOnly ? "bg-green-700 text-white border-green-700" : "border-border"}`}
              >✓ موثّقة نظيفة</button>
              <button
                onClick={() => setOnSale(!onSale)}
                className={`px-4 py-2 text-sm rounded-full border tap ${onSale ? "bg-gold text-gold-foreground border-gold" : "border-border"}`}
              >تخفيضات فقط</button>
            </div>
          </section>
        </div>
      </BottomSheet>
    </div>

  );
}
