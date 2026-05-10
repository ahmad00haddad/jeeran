import { Star } from "lucide-react";

const reviews = [
  { name: "ريم العبادي", city: "عمّان", text: "والله العباية فاقت توقعاتي، القماش ناعم وما يلزق بالجسم. لبستها بعرس بنت عمي وكلهم سألوني وين شاريتها!", rating: 5 },
  { name: "أم محمد", city: "الزرقاء", text: "أوّل مرة أطلب أونلاين وجاني الطلب نفس الصورة بالضبط. الدفع عند الاستلام أراحني كتير، شكراً جيران.", rating: 5 },
  { name: "هدى الشوبكي", city: "إربد", text: "الحجاب الكريمي بالحواف الذهبية جنّن! خامة ممتازة والسعر معقول. رح أطلب كمان قطع.", rating: 5 },
  { name: "نور الحسن", city: "الكرك", text: "الثوب الرجالي اللي طلبته لزوجي طلع تفصيل مظبوط، والخياطة نضيفة. كمل عنا.", rating: 5 },
];

export function Reviews() {
  return (
    <section className="py-16 bg-secondary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="text-gold text-xs tracking-[0.4em] uppercase mb-2">شو قالوا عنّا</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold">آراء جيراننا الأعزّاء</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((r, i) => (
            <div key={i} className="bg-card p-6 border border-border/60 hover:border-primary/40 transition">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: r.rating }).map((_, k) => (
                  <Star key={k} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm leading-relaxed font-serif-ar mb-4">"{r.text}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-border/60">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {r.name[0]}
                </div>
                <div>
                  <div className="text-sm font-bold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
