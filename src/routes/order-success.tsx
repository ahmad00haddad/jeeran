import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { CheckCircle, Package, Phone, Truck } from "lucide-react";
import { whatsappLink } from "@/lib/config";
import { TopBar } from "@/components/jeeran/TopBar";
import { Header } from "@/components/jeeran/Header";
import { Footer } from "@/components/jeeran/Footer";

export const Route = createFileRoute("/order-success")({
  validateSearch: (s: Record<string, unknown>) => ({ id: (s.id as string) || "" }),
  component: Success,
});

function Success() {
  const { id } = useSearch({ from: "/order-success" });
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar /><Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-card border border-border p-8">
          <CheckCircle className="w-20 h-20 text-primary mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold mb-2">شكراً يا قمر! ✨</h1>
          <p className="text-muted-foreground mb-6">طلبك وصلنا وعم نجهّزه. رح يتواصل معك المندوب لتأكيد التوصيل.</p>
          <div className="bg-secondary p-4 mb-4">
            <div className="text-xs text-muted-foreground">رقم الطلب — احفظيه لتتبّع طلبك</div>
            <div className="font-bold text-xl text-primary select-all">{id}</div>
          </div>
          <div className="space-y-2 text-right text-sm">
            <div className="flex items-center gap-2"><Package className="w-4 h-4 text-primary" /> الدفع عند الاستلام</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> رح نحكيك خلال ساعتين</div>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Link to="/track" className="bg-primary text-primary-foreground px-8 py-3 font-bold flex items-center justify-center gap-2">
              <Truck className="w-4 h-4" /> تتبّعي طلبك
            </Link>
            <a href={whatsappLink(`مرحبا، عملت طلب رقم ${id} وبدي أتأكد منه`)} className="border border-border px-8 py-3 font-bold">استفسري واتساب</a>
            <Link to="/" className="text-sm text-muted-foreground py-2">رجوع للرئيسية</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
