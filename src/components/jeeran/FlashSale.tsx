import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { products } from "./products";
import { ProductCard } from "./ProductCard";

function pad(n: number) { return n.toString().padStart(2, "0"); }

export function FlashSale() {
  const [time, setTime] = useState({ h: 5, m: 42, s: 18 });
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
    <section className="py-12 bg-deep text-cream relative overflow-hidden">
      <div className="absolute inset-0 arabesque opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Flame className="w-7 h-7 text-gold" />
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">تخفيضات فلاش</h2>
              <p className="text-cream/70 text-xs mt-0.5">عروض محدودة — لا تفوّتي الفرصة يا حلوة</p>
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
          {products.slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
}
