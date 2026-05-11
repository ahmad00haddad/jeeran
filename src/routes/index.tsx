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
      { title: "جيران — سوق الملابس المحتشمة المستعملة في الأردن" },
      { name: "description", content: "سوق أردني للملابس المحتشمة المستعملة بحالة ممتازة — عبايات، حجابات، ثياب رجالي وملابس أطفال بأسعار تناسب جيبك. الدفع عند الاستلام." },
      { property: "og:title", content: "جيران — Jeeran" },
      { property: "og:description", content: "ملابس مستعملة نظيفة من بيوتنا الأردنية. وفّري على جيبك وقللي الهدر." },
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
        <ProductRow title="وصل حديثاً للسوق" subtitle="آخر القطع اللي عرضوها جيراننا" items={newArrivals} />
        <HeritageStory />
        <ProductRow title="الأكثر طلباً" subtitle="القطع اللي بتطير من السوق بسرعة" items={bestSellers} />
        <Features />
        <Reviews />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
