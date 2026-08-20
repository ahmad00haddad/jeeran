import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X, Sparkles, Loader2 } from "lucide-react";
import { normalizePhone, normalizeName, isValidJoPhone } from "@/lib/phone";
import { notifyAdmin } from "@/lib/notify.functions";

type Props = {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  rentalPrice: number;
  rentalDays?: number | null;
  rentalDeposit?: number | null;
};

export function RentalDialog({ open, onClose, productId, productName, rentalPrice, rentalDays, rentalDeposit }: Props) {
  const [full_name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [event_date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  if (!open) return null;
  const cleanPhone = normalizePhone(phone);
  const validPhone = isValidJoPhone(cleanPhone);
  const cleanName = normalizeName(full_name);
  const validName = cleanName.length >= 3;
  const dirty = full_name || phone || event_date || message;

  function tryClose() {
    if (busy) return;
    if (dirty && !confirm("متأكدة تتركي بدون إرسال؟ البيانات رح تنمحي.")) return;
    onClose();
  }

  async function submit() {
    if (busy) return;
    if (!validName || !validPhone || !event_date) {
      toast.error("عبّي البيانات صح (الاسم، الرقم، تاريخ المناسبة)");
      return;
    }
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("rental_requests").insert({
      product_id: productId,
      user_id: user?.id ?? null,
      full_name: cleanName, phone: cleanPhone, event_date, message: message.trim(),
    });
    setBusy(false);
    if (error) { toast.error("صار خطأ، جرّبي مرة ثانية"); return; }
    void notifyAdmin({
      data: {
        kind: "rental",
        title: "طلب إيجار جديد",
        lines: [
          `القطعة: ${productName}`,
          `الاسم: ${cleanName}`,
          `الموبايل: ${cleanPhone}`,
          `تاريخ المناسبة: ${event_date}`,
          `سعر الإيجار: ${rentalPrice.toFixed(2)} د.أ`,
        ],
      },
    }).catch(() => {});
    toast.success("انرسل طلب الإيجار ✨", { description: "البائع رح يتواصل معك بالواتساب لتأكيد التوفر." });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={tryClose}>
      <div className="bg-card w-full max-w-md p-6 border border-border relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={tryClose} aria-label="إغلاق" className="absolute top-3 left-3 p-1"><X className="w-5 h-5" /></button>
        <h3 className="font-display text-xl font-bold mb-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold" /> استأجري هالقطعة
        </h3>
        <p className="text-xs text-muted-foreground mb-4">قطعة: {productName}</p>

        <div className="bg-secondary p-3 mb-4 text-sm space-y-1">
          <div className="flex justify-between"><span>سعر الإيجار:</span><strong className="text-primary">{rentalPrice.toFixed(2)} د.أ</strong></div>
          {rentalDays && <div className="flex justify-between"><span>المدة:</span><strong>{rentalDays} {rentalDays === 1 ? "يوم" : "أيام"}</strong></div>}
          {rentalDeposit && <div className="flex justify-between"><span>تأمين مسترد:</span><strong>{rentalDeposit.toFixed(2)} د.أ</strong></div>}
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-medium">الاسم *</span>
            <input value={full_name} onChange={(e) => setName(e.target.value)} onBlur={(e) => setName(normalizeName(e.target.value))} className={`w-full border px-3 py-2 mt-1 outline-none ${full_name && !validName ? "border-red-500" : "border-border focus:border-primary"}`} />
          </label>
          <label className="block">
            <span className="text-xs font-medium">رقم الموبايل *</span>
            <input value={phone} inputMode="tel" onChange={(e) => setPhone(e.target.value)} onBlur={(e) => setPhone(normalizePhone(e.target.value))} placeholder="07XXXXXXXX" className={`w-full border px-3 py-2 mt-1 outline-none ${phone && !validPhone ? "border-red-500" : "border-border focus:border-primary"}`} />
            {phone && !validPhone && <span className="text-xs text-red-500">رقم أردني غير صحيح</span>}
          </label>
          <label className="block">
            <span className="text-xs font-medium">تاريخ المناسبة *</span>
            <input type="date" min={new Date().toISOString().split("T")[0]} value={event_date} onChange={(e) => setDate(e.target.value)} className="w-full border border-border px-3 py-2 mt-1 outline-none focus:border-primary" />
          </label>
          <label className="block">
            <span className="text-xs font-medium">ملاحظة (المقاس، تفاصيل المناسبة...)</span>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} maxLength={300} className="w-full border border-border px-3 py-2 mt-1 outline-none focus:border-primary" />
          </label>
          <div className="text-[11px] text-muted-foreground bg-secondary p-2 leading-relaxed">
            البائع رح يتواصل معك بالواتساب لتأكيد التوفر بالتاريخ المطلوب. القطعة بتنحجز بس يأكد البائع، وبترجع بعد المناسبة بحالتها.
          </div>
          <button onClick={submit} disabled={busy} className="w-full bg-primary text-primary-foreground py-3 font-bold disabled:opacity-50 flex items-center justify-center gap-2">
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {busy ? "جارٍ الإرسال..." : "إرسال طلب الإيجار"}
          </button>
        </div>
      </div>
    </div>
  );
}
