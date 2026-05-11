import { Link } from "@tanstack/react-router";
import heroAbaya from "@/assets/hero-abaya.jpg";
import heroThobe from "@/assets/hero-thobe.jpg";

export function Hero() {
  return (
    <section className="relative bg-deep text-cream">
      <div className="grid md:grid-cols-2 gap-0 max-w-7xl mx-auto">
        <div className="p-8 md:p-14 flex flex-col justify-center min-h-[420px] md:min-h-[520px] order-2 md:order-1">
          <div className="text-[11px] tracking-[0.35em] text-gold uppercase mb-4">سوق جيران</div>
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.1] mb-5">
            ملابس <span className="gold-text">مستعملة</span><br />نظيفة بسعر يناسبك
          </h1>
          <p className="text-cream/75 max-w-md leading-relaxed text-sm md:text-base mb-6">
            قطع محتشمة من خزائن البيوت الأردنية — ملبوسة مرة أو ما انلبست أبداً، مفحوصة ومغسولة، بسعر أقل بكثير من سعرها الأصلي.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/shop" className="bg-gold text-gold-foreground px-7 py-3 font-bold text-sm tracking-wide hover:bg-cream transition">
              تصفّحي السوق
            </Link>
            <Link to="/shop" className="border border-cream/30 text-cream px-7 py-3 font-medium text-sm hover:bg-cream/10 transition">
              كيف بنشتغل؟
            </Link>
          </div>
        </div>
        <div className="relative order-1 md:order-2 grid grid-cols-2 gap-1">
          <img src={heroAbaya} alt="ملابس مستعملة محتشمة" className="w-full h-full object-cover aspect-[3/4] md:aspect-auto" />
          <img src={heroThobe} alt="ثوب رجالي مستعمل" className="w-full h-full object-cover aspect-[3/4] md:aspect-auto" />
        </div>
      </div>
    </section>
  );
}
