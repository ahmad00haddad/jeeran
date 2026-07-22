import { createFileRoute } from "@tanstack/react-router";
import { PageLayout, Section } from "@/components/jeeran/PageLayout";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
  head: () => ({
    meta: [
      { title: "سياسة الخصوصية — جيران" },
      { name: "description", content: "سياسة خصوصية جيران — كيف نجمع ونحمي بياناتك الشخصية." },
      { property: "og:title", content: "سياسة الخصوصية — جيران" },
      { property: "og:description", content: "سياسة خصوصية جيران وحماية بيانات المستخدم." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Privacy() {
  return (
    <PageLayout title="سياسة الخصوصية" subtitle="خصوصيتك أمانة عنّا">
      <Section title="مقدمة">
        <p>في جيران، منحترم خصوصية زبايننا ومنلتزم بحماية بياناتك الشخصية. هالسياسة بتوضّح شو البيانات اللي بنجمعها وكيف بنستخدمها.</p>
      </Section>

      <Section title="البيانات اللي بنجمعها">
        <ul className="list-disc pr-6 space-y-1">
          <li>الاسم الكامل ورقم الهاتف والبريد الإلكتروني.</li>
          <li>عنوان التوصيل (المحافظة والمنطقة والتفاصيل).</li>
          <li>سجل الطلبات والمفضلة.</li>
          <li>بيانات تقنية أساسية (نوع الجهاز، المتصفح) لتحسين تجربتك.</li>
        </ul>
      </Section>

      <Section title="كيف بنستخدم بياناتك">
        <ul className="list-disc pr-6 space-y-1">
          <li>تنفيذ طلباتك وتوصيلها.</li>
          <li>التواصل معك بخصوص الطلب (واتساب / إيميل).</li>
          <li>إرسال عروض وتنزيلات (بس لو اشتركتي بالنشرة).</li>
          <li>تحسين خدماتنا وتجربة الموقع.</li>
        </ul>
      </Section>

      <Section title="مشاركة البيانات">
        <p>ما بنبيع بياناتك ولا بنشاركها مع أي طرف تالت، ما عدا:</p>
        <ul className="list-disc pr-6 space-y-1">
          <li>شركات الشحن (لتوصيل الطلب فقط).</li>
          <li>الجهات الرسمية إذا طُلب قانونياً.</li>
        </ul>
      </Section>

      <Section title="أمان البيانات">
        <p>بيانات الدفع والحسابات مشفّرة ومحمية. كلمات المرور مخزّنة بشكل آمن وما حدا يقدر يشوفها — حتى فريق جيران.</p>
      </Section>

      <Section title="حقوقك">
        <ul className="list-disc pr-6 space-y-1">
          <li>الوصول لبياناتك وتعديلها من صفحة "حسابي".</li>
          <li>طلب حذف حسابك وبياناتك (تواصلي معنا).</li>
          <li>إلغاء الاشتراك بالنشرة في أي وقت.</li>
        </ul>
      </Section>

      <Section title="التواصل">
        <p>لأي استفسار عن الخصوصية: <a href="https://wa.me/962799256345" className="text-primary font-bold">واتساب جيران</a></p>
      </Section>
    </PageLayout>
  );
}
