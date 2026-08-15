import { Link } from "@tanstack/react-router";
import heroAbaya from "@/assets/hero-abaya.jpg";
import heroThobe from "@/assets/hero-thobe.jpg";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section className="relative bg-deep text-cream grain-strong">
      <div className="grid md:grid-cols-2 gap-0 max-w-7xl mx-auto">
        <div className="p-8 md:p-16 flex flex-col justify-center min-h-[440px] md:min-h-[560px] order-2 md:order-1">
          <Reveal>
            <div className="eyebrow mb-4">سوق جيران</div>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="type-display mb-5">
              ملابس <span className="gold-text">مستعملة</span><br />نظيفة بسعر يناسبك
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <div className="rule-gold mb-6" />
          </Reveal>
          <Reveal delay={260}>
            <p className="text-cream/75 max-w-md type-lead mb-7">
              قطع محتشمة من خزائن البيوت الأردنية — ملبوسة مرة أو ما انلبست أبداً، مفحوصة ومغسولة، بسعر أقل بكثير من سعرها الأصلي.
            </p>
          </Reveal>
          <Reveal delay={340}>
            <div className="flex flex-wrap gap-3">
              <Link to="/shop" search={{}} className="bg-gold text-gold-foreground px-8 py-3.5 font-bold text-sm tracking-wide hover:bg-cream transition-colors">
                تصفّحي السوق
              </Link>
              <Link to="/shop" search={{ q: "", sort: "new" }} className="border border-cream/30 text-cream px-8 py-3.5 font-medium text-sm hover:bg-cream/10 transition-colors">
                شوفي وصل حديثاً
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="relative order-1 md:order-2 grid grid-cols-2 gap-1">
          <div className="vignette overflow-hidden"><img src={heroAbaya} alt="ملابس مستعملة محتشمة" className="w-full h-full object-cover aspect-[3/4] md:aspect-auto" /></div>
          <div className="vignette overflow-hidden"><img src={heroThobe} alt="ثوب رجالي مستعمل" className="w-full h-full object-cover aspect-[3/4] md:aspect-auto" /></div>
        </div>
      </div>
    </section>
  );
}
