import { Star } from "lucide-react";

const reviews = [
  { name: "ريم العبادي", city: "عمّان", text: "اشتريت عباية ملبوسة مرة وحدة بنص السعر — والله ما بتفرق عن الجديدة. خدمة محترمة.", rating: 5 },
  { name: "أم محمد", city: "الزرقاء", text: "بعت ٨ قطع من خزانتي عن طريقهم، وصرت أشتري قطع ثانية بدالها. فكرة عبقرية.", rating: 5 },
  { name: "هدى الشوبكي", city: "إربد", text: "حجاب بـ ٣ دنانير وحالته ممتازة! وأنا اللي كنت بدفع ١٢ من محل عادي.", rating: 5 },
  { name: "نور الحسن", city: "الكرك", text: "ثوب رجالي لزوجي بحالة ممتازة وبربع السعر. التوصيل سريع وكل شي مغلف نظيف.", rating: 5 },
];

export function Reviews() {
  return (
    <section className="py-14 bg-secondary">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="text-gold text-xs tracking-[0.35em] uppercase mb-2">شو قالوا الجيران</div>
          <h2 className="font-display text-2xl md:text-3xl font-bold">تجارب حقيقية من ناسنا</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((r, i) => (
            <div key={i} className="bg-card p-5 border border-border/60">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: r.rating }).map((_, k) => (
                  <Star key={k} className="w-3.5 h-3.5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4">"{r.text}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-border/60">
                <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
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
