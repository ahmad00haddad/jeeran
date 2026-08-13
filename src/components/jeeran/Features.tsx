import { Truck, ShieldCheck, RotateCcw, Recycle } from "lucide-react";
import { Reveal } from "./Reveal";

const features = [
  { icon: ShieldCheck, title: "كل قطعة مفحوصة", text: "نتأكد من الحالة والنظافة قبل العرض" },
  { icon: Truck, title: "توصيل لكل الأردن", text: "شحن مجاني للطلبات فوق ٣٠ د.أ" },
  { icon: RotateCcw, title: "إرجاع خلال ٣ أيام", text: "إذا القطعة مش زي ما توقعتي" },
  { icon: Recycle, title: "صديق للبيئة", text: "قللي الهدر وأعطي ملابسك حياة جديدة" },
];

export function Features() {
  return (
    <section className="py-12 md:py-16 border-y border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 80} className="flex items-center gap-3">
            <div className="w-11 h-11 shrink-0 rounded-full hairline-gold text-primary flex items-center justify-center">
              <f.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">{f.title}</div>
              <div className="text-xs text-muted-foreground leading-tight">{f.text}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
