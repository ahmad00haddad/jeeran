import { createFileRoute } from "@tanstack/react-router";
import { PageLayout, Section } from "@/components/jeeran/PageLayout";

export const Route = createFileRoute("/terms")({
  component: Terms,
  head: () => ({
    meta: [
      { title: "الشروط والأحكام — جيران" },
      { name: "description", content: "الشروط والأحكام الخاصة بالتسوق واستخدام موقع جيران." },
      { property: "og:title", content: "الشروط والأحكام — جيران" },
      { property: "og:description", content: "الشروط والأحكام في جيران." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Terms() {
  return (
    <PageLayout title="الشروط والأحكام" subtitle="اقرأيها قبل ما تستخدمي الموقع">
      <Section title="١. قبول الشروط">
        <p>باستخدامك موقع جيران، بتوافقي على هالشروط. إذا ما بتوافقي، رجاءً ما تستخدمي الموقع.</p>
      </Section>

      <Section title="٢. طبيعة القطع">
        <p>كل القطع بجيران <b>مستعملة وفريدة</b> — يعني قطعة وحدة من كل موديل. القطعة اللي بتنباع بتخلص ما بترجع. الحالة والقياس والوصف بيتم توثيقهم بأمانة، بس ممكن يكون في اختلافات بسيطة بحكم إن القطعة مستعملة.</p>
      </Section>

      <Section title="٣. الأسعار والدفع">
        <ul className="list-disc pr-6 space-y-1">
          <li>الأسعار بالدينار الأردني وشاملة الضرائب.</li>
          <li>الدفع حالياً عند الاستلام فقط.</li>
          <li>جيران بتحتفظ بحق تعديل الأسعار في أي وقت.</li>
        </ul>
      </Section>

      <Section title="٤. الطلبات والحجز">
        <ul className="list-disc pr-6 space-y-1">
          <li>لما تضيفي قطعة للسلة وتبدأي الشيكاوت، القطعة بتنحجزلك لمدة 45 دقيقة.</li>
          <li>بعد تأكيد الطلب، بنتواصل معك خلال 24 ساعة لتأكيد التفاصيل.</li>
          <li>لجيران الحق برفض أي طلب بدون إبداء سبب.</li>
        </ul>
      </Section>

      <Section title="٥. خدمة الإيجار">
        <ul className="list-disc pr-6 space-y-1">
          <li>الإيجار بمقابل تأمين قابل للاسترجاع.</li>
          <li>لازم القطعة ترجع بنفس الحالة اللي استلمتيها فيها.</li>
          <li>أي ضرر أو بقعة صعبة الإزالة بتخصم من التأمين.</li>
          <li>التأخير عن موعد الإرجاع بيكلّف رسم يومي.</li>
        </ul>
      </Section>

      <Section title="٦. المسؤولية">
        <p>جيران غير مسؤولة عن أي ضرر غير مباشر ناتج عن استخدام الموقع أو المنتجات. الحد الأقصى لأي تعويض هو قيمة الطلب المتنازع عليه.</p>
      </Section>

      <Section title="٧. الملكية الفكرية">
        <p>كل المحتوى (النصوص، الصور، الشعار، التصميم) ملك جيران. ممنوع النسخ أو الاستخدام التجاري بدون إذن كتابي.</p>
      </Section>

      <Section title="٨. تعديل الشروط">
        <p>بنحتفظ بحق تعديل هالشروط في أي وقت، والتعديلات بتصير سارية بمجرد نشرها على الموقع.</p>
      </Section>

      <Section title="٩. القانون المطبّق">
        <p>هالشروط بتخضع للقانون الأردني، وأي نزاع بيتم حله في محاكم عمّان.</p>
      </Section>
    </PageLayout>
  );
}
