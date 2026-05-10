import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/jeeran/TopBar";
import { Header } from "@/components/jeeran/Header";
import { Footer } from "@/components/jeeran/Footer";
import { MobileNav } from "@/components/jeeran/MobileNav";
import { ProductCard } from "@/components/jeeran/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/store/cart";
import type { DBProduct } from "@/types/db";

export const Route = createFileRoute("/wishlist")({ component: Wishlist });

function Wishlist() {
  const { wishlist } = useCart();
  const [products, setProducts] = useState<DBProduct[]>([]);
  useEffect(() => {
    if (wishlist.length) supabase.from("products").select("*").in("id", wishlist).then(({ data }) => setProducts((data as DBProduct[]) || []));
    else setProducts([]);
  }, [wishlist]);

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <TopBar /><Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-6">مفضلتي ({wishlist.length})</h1>
        {wishlist.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">ما في عناصر بالمفضلة بعد</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </main>
      <Footer /><MobileNav />
    </div>
  );
}
