import { createFileRoute } from "@tanstack/react-router";
import { PageLayout, Section } from "@/components/jeeran/PageLayout";
import { MessageCircle, Mail, MapPin, Instagram } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "تواصلي معنا — جيران" },
      { name: "description", content: "طرق التواصل مع جيران: واتساب، إيميل، وسوشيال ميديا." },
      { property: "og:title", content: "تواصلي معنا — جيران" },
      { property: "og:description", content: "تواصلي مع فريق جيران بأي وقت." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Contact() {
  return (
    <PageLayout title="تواصلي معنا" subtitle="إحنا هون لأي سؤال أو استفسار">
      <div className="grid md:grid-cols-2 gap-4">
        <a href="https://wa.me/962799256345" className="border border-border bg-card p-5 hover:border-primary transition flex gap-4">
          <MessageCircle className="w-8 h-8 text-primary shrink-0" />
          <div>
            <h3 className="font-bold text-lg">واتساب</h3>
            <p className="text-muted-foreground text-sm mt-1 ltr:text-left" dir="ltr">+962 79 925 6345</p>
            <p className="text-xs text-muted-foreground mt-1">الرد خلال ساعة (٩ص - ٩م)</p>
          </div>
        </a>
        <a href="mailto:info@jeeran.jo" className="border border-border bg-card p-5 hover:border-primary transition flex gap-4">
          <Mail className="w-8 h-8 text-primary shrink-0" />
          <div>
            <h3 className="font-bold text-lg">إيميل</h3>
            <p className="text-muted-foreground text-sm mt-1">info@jeeran.jo</p>
            <p className="text-xs text-muted-foreground mt-1">للاستفسارات والشراكات</p>
          </div>
        </a>
        <div className="border border-border bg-card p-5 flex gap-4">
          <MapPin className="w-8 h-8 text-primary shrink-0" />
          <div>
            <h3 className="font-bold text-lg">الموقع</h3>
            <p className="text-muted-foreground text-sm mt-1">الزرقاء، الأردن</p>
            <p className="text-xs text-muted-foreground mt-1">التوصيل لكل المحافظات</p>
          </div>
        </div>
        <a href="https://instagram.com" className="border border-border bg-card p-5 hover:border-primary transition flex gap-4">
          <Instagram className="w-8 h-8 text-primary shrink-0" />
          <div>
            <h3 className="font-bold text-lg">إنستغرام</h3>
            <p className="text-muted-foreground text-sm mt-1">@jeeran.jo</p>
            <p className="text-xs text-muted-foreground mt-1">جديدنا أول بأول</p>
          </div>
        </a>
      </div>

      <Section title="ساعات العمل">
        <p>السبت - الخميس: ٩ صباحاً - ٩ مساءً</p>
        <p>الجمعة: ٢ ظهراً - ٩ مساءً</p>
      </Section>
    </PageLayout>
  );
}
