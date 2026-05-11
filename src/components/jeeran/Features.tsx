import { Truck, ShieldCheck, RotateCcw, Recycle } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "كل قطعة مفحوصة", text: "نتأكد من الحالة والنظافة قبل العرض" },
  { icon: Truck, title: "توصيل لكل الأردن", text: "شحن مجاني للطلبات فوق ٣٠ د.أ" },
  { icon: RotateCcw, title: "إرجاع خلال ٣ أيام", text: "إذا القطعة مش زي ما توقعتي" },
  { icon: Recycle, title: "صديق للبيئة", text: "قللي الهدر وأعطي ملابسك حياة جديدة" },
];

export function Features() {
  return (
    <section className="py-10 border-y border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-5">
        {features.map((f) => (
          <div key={f.title} className="flex items-center gap-3">
            <div className="w-11 h-11 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <f.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">{f.title}</div>
              <div className="text-xs text-muted-foreground leading-tight">{f.text}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
