import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  type: "offer" | "hold24h";
  currentPrice: number;
};

export function OfferDialog({ open, onClose, productId, productName, type, currentPrice }: Props) {
  const [full_name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(type === "offer" ? Math.max(1, Math.floor(currentPrice * 0.8)).toString() : "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  if (!open) return null;
  const isOffer = type === "offer";
  const validPhone = /^0?7[7-9]\d{7}$/.test(phone.replace(/\s/g, ""));

  async function submit() {
    if (!full_name || !validPhone || (isOffer && (!amount || Number(amount) <= 0))) {
      toast.error("عبّي البيانات صح");
      return;
    }
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("offers").insert({
      product_id: productId,
      user_id: user?.id ?? null,
      full_name, phone, message,
      type,
      amount: isOffer ? Number(amount) : null,
    });
    setBusy(false);
    if (error) { toast.error("صار خطأ، جرّبي مرة ثانية"); return; }
    toast.success(isOffer ? "انرسل عرضك للبائع ✨" : "انرسل طلب الحجز ✨", {
      description: "رح يتواصل معك خلال ساعات قليلة.",
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card w-full max-w-md p-6 border border-border relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 left-3"><X className="w-5 h-5" /></button>
        <h3 className="font-display text-xl font-bold mb-1">
          {isOffer ? "اعرضي سعرك" : "احجزيها 24 ساعة"}
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          {isOffer
            ? `قطعة: ${productName} — السعر الحالي ${currentPrice.toFixed(2)} د.أ`
            : `قطعة: ${productName} — احجزيها لحالك لمدة 24 ساعة قبل ما تقرري`}
        </p>

        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-medium">الاسم *</span>
            <input value={full_name} onChange={(e) => setName(e.target.value)} className="w-full border border-border px-3 py-2 mt-1 outline-none focus:border-primary" />
          </label>
          <label className="block">
            <span className="text-xs font-medium">رقم الموبايل *</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XXXXXXXX" className={`w-full border px-3 py-2 mt-1 outline-none ${phone && !validPhone ? "border-red-500" : "border-border focus:border-primary"}`} />
          </label>
          {isOffer && (
            <label className="block">
              <span className="text-xs font-medium">سعرك المقترح (د.أ) *</span>
              <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border border-border px-3 py-2 mt-1 outline-none focus:border-primary" />
            </label>
          )}
          <label className="block">
            <span className="text-xs font-medium">ملاحظة (اختياري)</span>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} className="w-full border border-border px-3 py-2 mt-1 outline-none focus:border-primary" />
          </label>
          <div className="text-[11px] text-muted-foreground bg-secondary p-2 leading-relaxed">
            {isOffer
              ? "البائع رح يراجع عرضك ويرد عليك بالواتساب. ما رح يتحجز للقطعة لما يقبل العرض."
              : "بعد ما يأكد البائع الحجز، القطعة بتختفي من المتجر لمدة 24 ساعة وبتكون محجوزة لك."}
          </div>
          <button onClick={submit} disabled={busy} className="w-full bg-primary text-primary-foreground py-3 font-bold disabled:opacity-50">
            {busy ? "..." : "إرسال"}
          </button>
        </div>
      </div>
    </div>
  );
}
