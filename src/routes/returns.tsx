import { createFileRoute } from "@tanstack/react-router";
import { PageLayout, Section } from "@/components/jeeran/PageLayout";
import { AlertCircle } from "lucide-react";

export const Route = createFileRoute("/returns")({
  component: Returns,
  head: () => ({
    meta: [
      { title: "الإرجاع والاستبدال — جيران" },
      { name: "description", content: "سياسة الإرجاع في جيران: إرجاع خلال 24 ساعة إذا القطعة مختلفة عن الوصف." },
      { property: "og:title", content: "الإرجاع والاستبدال — جيران" },
      { property: "og:description", content: "سياسة الإرجاع والاستبدال في جيران." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Returns() {
  return (
    <PageLayout title="الإرجاع والاستبدال" subtitle="راحتك أهم إشي عنّا">
      <div className="bg-gold/15 border border-gold/40 p-5 flex gap-3">
        <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
        <div className="text-sm">
          <b>ملاحظة مهمة:</b> بما إن قطعنا مستعملة وفريدة (قطعة وحدة من كل موديل)، الإرجاع بيكون محدود بالحالات اللي بتكون فيها القطعة مختلفة عن الوصف أو الصور.
        </div>
      </div>

      <Section title="متى بتقدري ترجّعي القطعة؟">
        <p>خلال <b>24 ساعة</b> من استلام الطلب، إذا:</p>
        <ul className="list-disc pr-6 space-y-1">
          <li>القطعة وصلتك بحالة مختلفة عن الوصف أو الصور.</li>
          <li>القياس مختلف عن المذكور بشكل واضح.</li>
          <li>القطعة فيها عيب ما كان مذكور بالوصف.</li>
        </ul>
      </Section>

      <Section title="شروط الإرجاع">
        <ul className="list-disc pr-6 space-y-1">
          <li>القطعة لازم ترجع بنفس حالتها اللي وصلتك فيها.</li>
          <li>مع التغليف الأصلي والفاتورة.</li>
          <li>ما تكون انلبست أو انغسلت.</li>
          <li>التواصل معنا خلال 24 ساعة من الاستلام على الواتساب.</li>
        </ul>
      </Section>

      <Section title="كيف بترجّعي القطعة؟">
        <ol className="list-decimal pr-6 space-y-1">
          <li>تواصلي معنا على واتساب: <a href="https://wa.me/962799256345" className="text-primary font-bold">‎+962 79 925 6345</a></li>
          <li>ابعتيلنا صور توضّح المشكلة.</li>
          <li>بنرتّبلك الاستلام من عندك (رسوم الاسترجاع علينا لو الخطأ منّا).</li>
          <li>بنرجّعلك المبلغ كاش أو رصيد شراء خلال 3 أيام عمل.</li>
        </ol>
      </Section>

      <Section title="بدون إرجاع في هالحالات">
        <ul className="list-disc pr-6 space-y-1">
          <li>الملابس الداخلية والحجابات (لأسباب صحية).</li>
          <li>قطع التنزيلات (Sale) — البيع نهائي.</li>
          <li>القطع اللي انلبست أو انغسلت.</li>
        </ul>
      </Section>
    </PageLayout>
  );
}
