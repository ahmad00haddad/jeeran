import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/jeeran/TopBar";
import { Header } from "@/components/jeeran/Header";
import { Footer } from "@/components/jeeran/Footer";
import { MobileNav } from "@/components/jeeran/MobileNav";
import { useCart, cartTotals } from "@/store/cart";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Phone, MapPin, User, Check } from "lucide-react";
import { toast } from "sonner";

const cities = ["عمّان","الزرقاء","إربد","العقبة","الكرك","المفرق","مأدبا","جرش","عجلون","الطفيلة","معان","البلقاء"];

export const Route = createFileRoute("/checkout")({ component: Checkout });

function Checkout() {
  const navigate = useNavigate();
  const { items, clear } = useCart();
  const { subtotal, shipping, total } = cartTotals(items);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", city: "عمّان", address: "", notes: "" });

  const validPhone = /^0?7[7-9]\d{7}$/.test(form.phone.replace(/\s/g, ""));

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar /><Header />
        <main className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">السلة فاضية</h1>
            <Link to="/shop" className="inline-block mt-4 bg-primary text-primary-foreground px-6 py-3 font-bold">تسوقي الآن</Link>
          </div>
        </main>
        <Footer /><MobileNav />
      </div>
    );
  }

  async function placeOrder() {
    if (!form.full_name || !validPhone || !form.address) { toast.error("عبّي البيانات المطلوبة"); return; }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc("create_order_atomic", {
        _items: items.map((i) => ({
          product_id: i.id,
          quantity: 1,
          price: i.price,
          size: i.size ?? null,
          color: i.color ?? null,
        })),
        _customer: {
          full_name: form.full_name,
          phone: form.phone,
          city: form.city,
          address: form.address,
          notes: form.notes,
        },
        _shipping: shipping,
      });
      if (error) {
        const m = error.message || "";
        if (m.includes("PRODUCT_SOLD")) toast.error("للأسف، إحدى القطع انباعت قبل ما تأكدي الطلب 😔");
        else if (m.includes("PRODUCT_RESERVED")) toast.error("إحدى القطع محجوزة حالياً لطلب آخر، جرّبي بعد شوي");
        else if (m.includes("PRODUCT_NOT_FOUND")) toast.error("إحدى القطع لم تعد متوفرة");
        else if (m.includes("EMPTY_CART")) toast.error("السلة فاضية");
        else if (m.includes("MISSING_CUSTOMER_FIELDS")) toast.error("عبّي كل البيانات المطلوبة");
        else toast.error("صار خطأ، حاولي مرة ثانية");
        setSubmitting(false);
        setStep(2);
        return;
      }
      const row = Array.isArray(data) ? data[0] : data;
      const orderNumber = (row as any)?.order_number as string | undefined;
      clear();
      toast.success("تم تأكيد طلبك بنجاح! ✨");
      navigate({ to: "/order-success", search: { id: orderNumber ?? "" } });
    } catch {
      toast.error("صار خطأ، حاولي مرة ثانية");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <TopBar /><Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="font-display text-3xl font-bold mb-6">إتمام الطلب</h1>

        <div className="flex items-center gap-2 mb-8">
          {[
            { n: 1, l: "البيانات" },
            { n: 2, l: "المراجعة" },
            { n: 3, l: "التأكيد" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s.n ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                {step > s.n ? <Check className="w-4 h-4" /> : s.n}
              </div>
              <span className={`text-sm ${step >= s.n ? "font-bold" : "text-muted-foreground"}`}>{s.l}</span>
              {i < 2 && <div className={`flex-1 h-0.5 ${step > s.n ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-card p-6 border border-border space-y-4">
            {step === 1 && (
              <>
                <h2 className="font-bold text-lg mb-2">معلومات التوصيل</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium flex items-center gap-1 mb-1"><User className="w-3 h-3" /> الاسم الكامل *</span>
                    <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full border border-border px-3 py-2 focus:border-primary outline-none" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium flex items-center gap-1 mb-1"><Phone className="w-3 h-3" /> رقم الموبايل *</span>
                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="07XXXXXXXX" className={`w-full border px-3 py-2 outline-none ${form.phone && !validPhone ? "border-red-500" : "border-border focus:border-primary"}`} />
                    {form.phone && !validPhone && <span className="text-xs text-red-500">رقم أردني غير صحيح</span>}
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium flex items-center gap-1 mb-1"><MapPin className="w-3 h-3" /> المحافظة</span>
                    <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full border border-border px-3 py-2 bg-cream">
                      {cities.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </label>
                </div>
                <label className="block">
                  <span className="text-sm font-medium mb-1">العنوان التفصيلي *</span>
                  <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} className="w-full border border-border px-3 py-2 focus:border-primary outline-none" placeholder="الحي، الشارع، رقم البيت، علامة مميزة" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium mb-1">ملاحظات (اختياري)</span>
                  <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full border border-border px-3 py-2 focus:border-primary outline-none" />
                </label>
                <button onClick={() => setStep(2)} disabled={!form.full_name || !validPhone || !form.address} className="w-full bg-primary text-primary-foreground py-3 font-bold disabled:opacity-50 mt-2">متابعة ←</button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="font-bold text-lg mb-4">راجعي طلبك</h2>
                <div className="bg-secondary p-4 text-sm space-y-1 mb-4">
                  <div><strong>الاسم:</strong> {form.full_name}</div>
                  <div><strong>الموبايل:</strong> {form.phone}</div>
                  <div><strong>العنوان:</strong> {form.city} — {form.address}</div>
                </div>
                <div className="space-y-2 mb-4">
                  {items.map((i) => (
                    <div key={i.id + (i.size || "")} className="flex justify-between text-sm border-b border-border pb-2">
                      <span className="flex-1">{i.name_ar} × {i.quantity}</span>
                      <span className="font-bold">{(i.price * i.quantity).toFixed(2)} د.أ</span>
                    </div>
                  ))}
                </div>
                <div className="border border-gold p-3 flex items-start gap-2 bg-gold/10 mb-4">
                  <ShieldCheck className="w-5 h-5 text-gold-foreground flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-bold">الدفع عند الاستلام (COD)</div>
                    <div className="text-muted-foreground">ادفعي لما يوصلك الطلب — كاش بيد المندوب.</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep(1)} className="px-6 py-3 border border-border font-bold">رجوع</button>
                  <button onClick={() => { setStep(3); placeOrder(); }} disabled={submitting} className="flex-1 bg-primary text-primary-foreground py-3 font-bold disabled:opacity-50">تأكيد الطلب</button>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="text-center py-12">
                {submitting ? <p>جارٍ إرسال طلبك...</p> : <p>تمت معالجة طلبك ✨</p>}
              </div>
            )}
          </div>

          <aside className="bg-card p-6 border border-border h-fit space-y-3">
            <h3 className="font-bold mb-3">ملخص الطلب</h3>
            {items.map((i) => (
              <div key={i.id + (i.size || "")} className="flex justify-between text-sm">
                <span>{i.name_ar} ×{i.quantity}</span>
                <span>{(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span>المجموع</span><span>{subtotal.toFixed(2)} د.أ</span></div>
              <div className="flex justify-between"><span>الشحن</span><span>{shipping === 0 ? "مجاناً" : `${shipping.toFixed(2)} د.أ`}</span></div>
              <div className="flex justify-between font-bold text-lg text-primary pt-2 border-t border-border"><span>الإجمالي</span><span>{total.toFixed(2)} د.أ</span></div>
            </div>
          </aside>
        </div>
      </main>
      <Footer /><MobileNav />
    </div>
  );
}
