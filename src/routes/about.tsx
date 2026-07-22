import { createFileRoute, Link } from "@tanstack/react-router";
import { PageLayout, Section } from "@/components/jeeran/PageLayout";
import { Heart, Recycle, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "من نحن — جيران | سوق الملابس المحتشمة المستعملة في الأردن" },
      { name: "description", content: "جيران فكرة أردنية بتجمع الجيران على قطع محتشمة نظيفة بسعر يناسب الجيبة. تعرّفي على قصتنا ورسالتنا." },
      { property: "og:title", content: "من نحن — جيران" },
      { property: "og:description", content: "قصة جيران: سوق أردني للملابس المحتشمة المستعملة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function About() {
  return (
    <PageLayout title="من نحن" subtitle="جيران — لأن ملابسك القديمة إلها قيمة">
      <Section title="القصة">
        <p>
          جيران بدأت بفكرة بسيطة: كل بيت أردني فيه قطع ملابس محتشمة نظيفة ومرتبة، لبستها صاحبتها مرة أو مرتين وصارت مركونة بالخزانة. بنفس الوقت، في بنات كتير بيدوّروا على قطعة أنيقة بسعر يريح الجيبة — خصوصاً لمناسبة أو موسم.
        </p>
        <p>
          من هون جت فكرة "جيران" — سوق أردني إلكتروني يجمع الجارة اللي بدها تفرغ خزانتها مع الجارة اللي بدها قطعة حلوة بنص السعر، وكل هالشي بجو من الثقة والاحتشام.
        </p>
      </Section>

      <Section title="رسالتنا">
        <p>
          نوصّل الملابس المحتشمة النظيفة لكل بيت أردني بسعر عادل، وبنفس الوقت نساهم بتقليل هدر الملابس ونشجّع ثقافة إعادة الاستخدام (Reuse) بدل الرمي.
        </p>
      </Section>

      <Section title="ليش جيران؟">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border border-border p-5 bg-card">
            <ShieldCheck className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold mb-1">قطع موثّقة نظيفة</h3>
            <p className="text-sm text-muted-foreground">كل قطعة بتنفحص وبتنغسل وبتنكوى قبل ما توصلك.</p>
          </div>
          <div className="border border-border p-5 bg-card">
            <Heart className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold mb-1">أسعار الجيران</h3>
            <p className="text-sm text-muted-foreground">أسعار عادلة — لأن الفكرة مساعدة، مش أرباح.</p>
          </div>
          <div className="border border-border p-5 bg-card">
            <Recycle className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold mb-1">صديقة للبيئة</h3>
            <p className="text-sm text-muted-foreground">كل قطعة بتلبسيها مرة تانية = تقليل هدر وتلوث.</p>
          </div>
        </div>
      </Section>

      <Section title="بدك تعرفي أكثر؟">
        <p>
          <Link to="/contact" className="text-primary font-bold">تواصلي معنا</Link> أو زوري{" "}
          <Link to="/shop" className="text-primary font-bold">المتجر</Link>.
        </p>
      </Section>
    </PageLayout>
  );
}
