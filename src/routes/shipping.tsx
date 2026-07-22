import { createFileRoute } from "@tanstack/react-router";
import { PageLayout, Section } from "@/components/jeeran/PageLayout";
import { Truck, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/shipping")({
  component: Shipping,
  head: () => ({
    meta: [
      { title: "الشحن والتوصيل — جيران" },
      { name: "description", content: "تفاصيل الشحن والتوصيل داخل الأردن: المدة، الرسوم، والشحن المجاني للطلبات فوق 50 دينار." },
      { property: "og:title", content: "الشحن والتوصيل — جيران" },
      { property: "og:description", content: "تفاصيل الشحن والتوصيل داخل الأردن." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Shipping() {
  return (
    <PageLayout title="الشحن والتوصيل" subtitle="نوصّلك لباب البيت بكل الأردن">
      <Section title="مدة التوصيل">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-border p-5 bg-card flex gap-3">
            <MapPin className="w-6 h-6 text-primary shrink-0" />
            <div>
              <h3 className="font-bold">داخل عمّان والزرقاء</h3>
              <p className="text-sm text-muted-foreground">1 - 2 يوم عمل</p>
            </div>
          </div>
          <div className="border border-border p-5 bg-card flex gap-3">
            <Clock className="w-6 h-6 text-primary shrink-0" />
            <div>
              <h3 className="font-bold">باقي المحافظات</h3>
              <p className="text-sm text-muted-foreground">3 - 5 أيام عمل</p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="رسوم الشحن">
        <ul className="space-y-2">
          <li>🚚 <b>عمّان والزرقاء:</b> 3 د.أ</li>
          <li>🚚 <b>باقي المحافظات:</b> 5 د.أ</li>
          <li>🎁 <b>شحن مجاني</b> لكل طلب يزيد عن 50 د.أ</li>
        </ul>
      </Section>

      <Section title="كيف بيوصلك الطلب؟">
        <p>بعد تأكيد الطلب، بنجهزلك القطعة خلال 24 ساعة، وبنتواصل معك على الواتساب لتأكيد العنوان وموعد التوصيل. بنستخدم شركات شحن أردنية موثوقة.</p>
      </Section>

      <Section title="الدفع">
        <p>حالياً بنعتمد <b>الدفع عند الاستلام (COD)</b> لكل الطلبات داخل الأردن — بتدفعي كاش لمندوب التوصيل لما القطعة توصلك.</p>
      </Section>

      <Section title="عندك سؤال؟">
        <p>تواصلي معنا على الواتساب: <a href="https://wa.me/962799256345" className="text-primary font-bold">‎+962 79 925 6345</a></p>
      </Section>
    </PageLayout>
  );
}
