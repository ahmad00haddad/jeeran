import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/jeeran/TopBar";
import { Header } from "@/components/jeeran/Header";
import { Footer } from "@/components/jeeran/Footer";
import { MobileNav } from "@/components/jeeran/MobileNav";
import { ProductCard } from "@/components/jeeran/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import type { DBProduct, Category } from "@/types/db";

export const Route = createFileRoute("/shop/$slug")({ component: CatPage });

function CatPage() {
  const { slug } = useParams({ from: "/shop/$slug" });
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [cat, setCat] = useState<Category | null>(null);

  useEffect(() => {
    (async () => {
      const { data: c } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
      setCat(c as Category);
      if (c) {
        const { data } = await supabase.from("products").select("*").eq("category_id", c.id).eq("active", true).limit(200);
        setProducts((data as DBProduct[]) || []);
      }
    })();
  }, [slug]);

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <TopBar />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="font-display text-3xl font-bold mb-2">{cat?.name_ar || slug}</h1>
        <p className="text-muted-foreground text-sm mb-6">{products.length} قطعة من تشكيلة جيران</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {products.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
