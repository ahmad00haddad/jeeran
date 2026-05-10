import { Truck, Shield, RotateCcw, Phone } from "lucide-react";

const features = [
  { icon: Truck, title: "شحن مجاني", text: "للطلبات فوق ٢٠ د.أ داخل الأردن" },
  { icon: Phone, title: "الدفع عند الاستلام", text: "ادفعي لما يوصلك الطلب على الباب" },
  { icon: RotateCcw, title: "إرجاع مجاني", text: "خلال ١٤ يوم بدون أي أسئلة" },
  { icon: Shield, title: "ضمان الجودة", text: "خامات طبيعية مفحوصة قبل الشحن" },
];

export function Features() {
  return (
    <section className="py-10 border-y border-border bg-cream">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((f) => (
          <div key={f.title} className="flex items-center gap-3">
            <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <f.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">{f.title}</div>
              <div className="text-xs text-muted-foreground">{f.text}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
