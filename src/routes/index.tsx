import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/jeeran/TopBar";
import { Header } from "@/components/jeeran/Header";
import { Hero } from "@/components/jeeran/Hero";
import { CategoryCircles } from "@/components/jeeran/CategoryCircles";
import { FlashSale } from "@/components/jeeran/FlashSale";
import { ProductRow } from "@/components/jeeran/ProductRow";
import { HeritageStory } from "@/components/jeeran/HeritageStory";
import { Features } from "@/components/jeeran/Features";
import { Reviews } from "@/components/jeeran/Reviews";
import { Footer } from "@/components/jeeran/Footer";
import { MobileNav } from "@/components/jeeran/MobileNav";
import { supabase } from "@/integrations/supabase/client";
import type { DBProduct } from "@/types/db";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "جيران — حيث تلتقي الفخامة بالانتماء | ملابس محتشمة أردنية" },
      { name: "description", content: "جيران: عبايات، حجابات، ثياب رجالي وملابس أطفال محتشمة بلمسة شامية أردنية. شحن مجاني والدفع عند الاستلام داخل الأردن." },
      { property: "og:title", content: "جيران — Jeeran" },
      { property: "og:description", content: "ملابس محتشمة تنتقل بين الأجيال — صناعة أردنية أصيلة." },
    ],
  }),
});

function Index() {
  const [newArrivals, setNewArrivals] = useState<DBProduct[]>([]);
  const [bestSellers, setBestSellers] = useState<DBProduct[]>([]);

  useEffect(() => {
    supabase.from("products").select("*").order("created_at", { ascending: false }).limit(8)
      .then(({ data }) => setNewArrivals((data as DBProduct[]) || []));
    supabase.from("products").select("*").order("reviews_count", { ascending: false }).limit(8)
      .then(({ data }) => setBestSellers((data as DBProduct[]) || []));
  }, []);

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <TopBar />
      <Header />
      <main>
        <Hero />
        <CategoryCircles />
        <FlashSale />
        <ProductRow title="وصل حديثاً يا ربيع" subtitle="آخر التشكيلات اللي وصلت لمستودعنا — قبل ما تخلص" items={newArrivals} />
        <HeritageStory />
        <ProductRow title="الأكثر طلباً عندنا" subtitle="القطع اللي بناتنا اختاروها أكتر هالأسبوع" items={bestSellers} />
        <Features />
        <Reviews />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
