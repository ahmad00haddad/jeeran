import { Reveal } from "./Reveal";

export function HeritageStory() {
  return (
    <section className="py-20 md:py-28 bg-deep text-cream grain-strong">
      <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
        <Reveal>
          <div className="eyebrow">قصة جيران</div>
        </Reveal>
        <Reveal delay={90}>
          <h2 className="type-h2 font-display leading-tight">
            ملابسك القديمة <span className="gold-text">إلها قيمة</span>
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <div className="rule-gold mx-auto" />
        </Reveal>
        <Reveal delay={240}>
          <p className="type-lead text-cream/80 max-w-2xl mx-auto">
            جيران سوق أردني للملابس المحتشمة المستعملة من بيت لبيت. كل قطعة عندنا ملبوسة مرة أو مرتين فقط — أو ما انلبست أبداً — مفحوصة، مغسولة، وجاهزة تلاقي بيت جديد. وفّري على جيبك، وقللي الهدر، وخلي ملابسك تكمل حياتها عند ناس بحبوها.
          </p>
        </Reveal>
        <Reveal delay={320}>
          <div className="flex flex-wrap justify-center gap-6 pt-4 text-[11px] tracking-[0.2em] uppercase text-gold">
            <span>فحص قبل البيع</span>
            <span className="text-cream/30">◆</span>
            <span>أسعار حقيقية</span>
            <span className="text-cream/30">◆</span>
            <span>توصيل لكل الأردن</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
