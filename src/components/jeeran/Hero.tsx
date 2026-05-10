import { Link } from "@tanstack/react-router";
import heroAbaya from "@/assets/hero-abaya.jpg";
import heroThobe from "@/assets/hero-thobe.jpg";

export function Hero() {
  return (
    <section className="relative">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="relative arabesque text-cream p-8 md:p-16 flex flex-col justify-between min-h-[520px] md:min-h-[640px] order-2 md:order-1">
          <div className="text-xs tracking-[0.4em] text-gold uppercase">Heritage Collection ٢٠٢٥</div>
          <div className="space-y-6">
            <div className="text-gold text-sm font-medium">حيث تلتقي الفخامة بالانتماء</div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05]">
              أناقة <span className="gold-text">لا تحتاج</span>
              <br />
              أن تُعرَّف
            </h1>
            <p className="text-cream/80 max-w-md leading-relaxed text-base md:text-lg font-serif-ar">
              تشكيلة موسم الخريف من جيران — عبايات، ثياب، وحجابات بلمسة شامية أصيلة، مصنوعة بإتقان لتنتقل بين الأجيال.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Link to="/shop" className="bg-cream text-deep px-8 py-3.5 font-bold text-sm tracking-wide hover:bg-gold transition">
                تسوقي الآن
              </Link>
              <Link to="/shop/$slug" params={{ slug: "abayas" }} className="border border-cream/40 text-cream px-8 py-3.5 font-medium text-sm hover:bg-cream/10 transition">
                اكتشف العبايات
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-cream/60">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-gold">★</span>
              ))}
            </div>
            <span>أكثر من ٢٥٠٠٠ عميلة سعيدة في الأردن</span>
          </div>
        </div>
        <div className="relative order-1 md:order-2 grid grid-cols-2 gap-1">
          <div className="relative aspect-[3/4] md:aspect-auto">
            <img src={heroAbaya} alt="عباية فاخرة" className="w-full h-full object-cover" />
          </div>
          <div className="relative aspect-[3/4] md:aspect-auto">
            <img src={heroThobe} alt="ثوب رجالي" className="w-full h-full object-cover" />
            <div className="absolute bottom-4 right-4 bg-cream/95 backdrop-blur px-3 py-2 text-[10px] tracking-widest font-bold">
              رجالي · جديد
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
