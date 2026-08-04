import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/jeeran/TopBar";
import { Header } from "@/components/jeeran/Header";
import { Footer } from "@/components/jeeran/Footer";
import { MobileNav } from "@/components/jeeran/MobileNav";
import { supabase } from "@/integrations/supabase/client";
import { normalizePhone } from "@/lib/phone";
import { getLocalOrders, ORDER_STATUS_AR } from "@/lib/orderTracking";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { Search, Loader2, PackageCheck } from "lucide-react";

export const Route = createFileRoute("/track")({
  component: Track,
  head: () => ({
    meta: [
      { title: "تتبّع طلبك — جيران" },
      { name: "description", content: "تابعي حالة طلبك في جيران برقم الطلب ورقم موبايلك، بدون حساب." },
      { property: "og:title", content: "تتبّع طلبك — جيران" },
      { property: "og:description", content: "تابعي حالة طلبك في جيران برقم الطلب ورقم موبايلك." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type TrackResult = {
  order_number: string;
  status: string;
  created_at: string;
  full_name: string;
  city: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: { name_ar: string; image_url: string | null; price: number }[];
};

const STEPS = ["بانتظار التأكيد", "تم التأكيد", "بالطريق إلك", "تم التسليم"];

function Track() {
  const [num, setNum] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [mine, setMine] = useState<ReturnType<typeof getLocalOrders>>([]);

  useEffect(() => { setMine(getLocalOrders()); }, []);

  async function lookup(orderNumber: string, rawPhone: string) {
    const cleanPhone = normalizePhone(rawPhone);
    if (!orderNumber.trim() || cleanPhone.length < 7) { setNotFound(true); setResult(null); return; }
    setBusy(true); setNotFound(false);
    const { data, error } = await supabase.rpc("track_order", {
      _order_number: orderNumber.trim(),
      _phone: cleanPhone,
    });
    setBusy(false);
    if (error || !data) { setResult(null); setNotFound(true); return; }
    setResult(data as unknown as TrackResult);
  }

  const info = result ? ORDER_STATUS_AR[result.status] ?? ORDER_STATUS_AR.pending : null;

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <TopBar /><Header />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-1">تتبّعي طلبك</h1>
        <p className="text-sm text-muted-foreground mb-6">اكتبي رقم الطلب ورقم الموبايل يلي طلبتي فيه — بدون ما تسجّلي دخول.</p>

        <form
          onSubmit={(e) => { e.preventDefault(); lookup(num, phone); }}
          className="bg-card border border-border p-4 grid sm:grid-cols-[1fr_1fr_auto] gap-3 mb-6"
        >
          <input value={num} onChange={(e) => setNum(e.target.value)} placeholder="رقم الطلب (JR250801XXXX)" className="border border-border px-3 py-2.5 outline-none focus:border-primary" />
          <input value={phone} inputMode="tel" onChange={(e) => setPhone(e.target.value)} onBlur={(e) => setPhone(normalizePhone(e.target.value))} placeholder="07XXXXXXXX" className="border border-border px-3 py-2.5 outline-none focus:border-primary" />
          <button disabled={busy} className="bg-primary text-primary-foreground px-6 py-2.5 font-bold flex items-center justify-center gap-2 disabled:opacity-50">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} تتبّعي
          </button>
        </form>

        {mine.length > 0 && !result && (
          <div className="mb-6">
            <h2 className="font-bold mb-2 text-sm">طلباتك من هالجهاز</h2>
            <div className="space-y-2">
              {mine.map((o) => (
                <button
                  key={o.order_number}
                  onClick={() => { setNum(o.order_number); setPhone(o.phone); lookup(o.order_number, o.phone); }}
                  className="w-full bg-card border border-border p-3 flex items-center justify-between text-sm hover:border-gold transition"
                >
                  <span className="font-bold text-primary">{o.order_number}</span>
                  <span className="text-muted-foreground text-xs">{new Date(o.at).toLocaleDateString("ar-JO")}</span>
                  <span className="font-bold">{Number(o.total).toFixed(2)} د.أ</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {notFound && (
          <div className="bg-card border border-destructive/40 p-4 text-sm">
            ما لقينا طلب بهالرقم مع هالموبايل. تأكدي من رقم الطلب، أو راسلينا على{" "}
            <a className="text-primary font-bold" href={`https://wa.me/${WHATSAPP_NUMBER}`}>واتساب</a>.
          </div>
        )}

        {result && info && (
          <div className="bg-card border border-border">
            <div className="p-5 border-b border-border">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">رقم الطلب</div>
                  <div className="font-bold text-xl text-primary">{result.order_number}</div>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 bg-gold/20 text-gold-foreground">{info.label}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{info.hint}</p>
            </div>

            {info.step > 0 && (
              <div className="p-5 border-b border-border">
                <div className="flex items-center">
                  {STEPS.map((s, i) => (
                    <div key={s} className="flex-1 flex items-center">
                      <div className={`flex flex-col items-center gap-1 ${i + 1 <= info.step ? "text-primary" : "text-muted-foreground"}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i + 1 <= info.step ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{i + 1}</div>
                        <span className="text-[10px] whitespace-nowrap">{s}</span>
                      </div>
                      {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${i + 1 < info.step ? "bg-primary" : "bg-border"}`} />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-5 space-y-3">
              {result.items.map((it, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  {it.image_url && <img src={it.image_url} alt={it.name_ar} loading="lazy" className="w-12 h-14 object-cover" />}
                  <span className="flex-1">{it.name_ar}</span>
                  <span className="font-bold">{Number(it.price).toFixed(2)} د.أ</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 text-sm space-y-1">
                <div className="flex justify-between"><span>المجموع</span><span>{Number(result.subtotal).toFixed(2)} د.أ</span></div>
                <div className="flex justify-between"><span>التوصيل</span><span>{Number(result.shipping).toFixed(2)} د.أ</span></div>
                <div className="flex justify-between font-bold text-lg text-primary"><span>الإجمالي</span><span>{Number(result.total).toFixed(2)} د.أ</span></div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`مرحبا، بستفسر عن طلبي رقم ${result.order_number}`)}`} className="bg-primary text-primary-foreground px-5 py-2.5 font-bold text-sm">استفسري عن الطلب واتساب</a>
                <Link to="/shop" className="border border-border px-5 py-2.5 font-bold text-sm">كمّلي تسوّق</Link>
              </div>
            </div>
          </div>
        )}

        {!result && !notFound && mine.length === 0 && (
          <div className="text-center text-muted-foreground py-10">
            <PackageCheck className="w-12 h-12 mx-auto mb-3 opacity-40" />
            رقم الطلب بتلاقيه بصفحة تأكيد الطلب أو برسالة الواتساب من عنا.
          </div>
        )}
      </main>
      <Footer /><MobileNav />
    </div>
  );
}
