import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { supabase } from "@/integrations/supabase/client";
import type { DBProduct } from "@/types/db";

function pad(n: number) { return n.toString().padStart(2, "0"); }

export function FlashSale() {
  const [time, setTime] = useState({ h: 5, m: 42, s: 18 });
  const [items, setItems] = useState<DBProduct[]>([]);

  useEffect(() => {
    const nowIso = new Date().toISOString();
    supabase.from("products").select("*").eq("sold", false).or(`reserved_until.is.null,reserved_until.lt.${nowIso}`).not("sale_price", "is", null).order("created_at", { ascending: false }).limit(4)
      .then(({ data }) => setItems((data as DBProduct[]) || []));
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTime((t) => {
        let { h, m, s } = t;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-10 bg-deep text-cream">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-gold" />
            <div>
              <h2 className="font-display text-xl md:text-2xl font-bold">عروض اليوم</h2>
              <p className="text-cream/65 text-xs mt-0.5">قطع مختارة بأسعار خاصة — لفترة محدودة</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-cream/70 ml-2">ينتهي خلال:</span>
            {[time.h, time.m, time.s].map((v, i) => (
              <div key={i} className="bg-primary text-primary-foreground font-bold px-3 py-2 min-w-12 text-center tabular-nums">
                {pad(v)}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}
