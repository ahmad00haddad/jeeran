import { useEffect } from "react";
import { X, ShoppingBag, Trash2, AlertTriangle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart, cartTotals } from "@/store/cart";
import { resolveImg } from "@/lib/imageMap";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, remove } = useCart();
  const { subtotal, shipping, total, count } = cartTotals(items);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open || items.length === 0) return;
    const ids = items.map((i) => i.id);
    (async () => {
      const { data, error } = await supabase.rpc("check_items_availability", { _product_ids: ids });
      if (error || !data) return;
      const unavailable = (data as { product_id: string; available: boolean; reason: string }[]).filter((r) => !r.available);
      if (unavailable.length === 0) return;
      const removedNames: string[] = [];
      unavailable.forEach((u) => {
        const it = items.find((i) => i.id === u.product_id);
        if (it) {
          removedNames.push(it.name_ar);
          remove(it.id, it.size);
        }
      });
      if (removedNames.length > 0) {
        toast.warning("بعض القطع ما عادت متوفرة وانحذفت من السلة", {
          description: removedNames.slice(0, 3).join("، ") + (removedNames.length > 3 ? "…" : ""),
          icon: <AlertTriangle className="w-4 h-4" />,
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 animate-in fade-in duration-200" onClick={onClose} />
      {/* Mobile: bottom sheet. Desktop: side drawer */}
      <aside
        className="
          absolute bg-cream flex flex-col shadow-2xl
          bottom-0 inset-x-0 max-h-[90dvh] rounded-t-2xl animate-in slide-in-from-bottom duration-250
          md:top-0 md:left-0 md:right-auto md:bottom-0 md:h-full md:w-full md:max-w-md md:rounded-none md:animate-none
        "
      >
        {/* Drag handle (mobile) */}
        <div className="pt-2 pb-1 flex justify-center md:hidden">
          <div className="w-10 h-1.5 rounded-full bg-border" />
        </div>
        <header className="flex items-center justify-between p-4 border-b border-border bg-deep text-cream md:rounded-none">
          <div className="flex items-center gap-2 font-bold">
            <ShoppingBag className="w-5 h-5" /> سلة المشتريات ({count})
          </div>
          <button onClick={onClose} className="p-1 hover:text-gold tap" aria-label="إغلاق"><X /></button>
        </header>
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3">
          {items.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <ShoppingBag className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p>السلة فاضية يا حلوة</p>
              <Link to="/shop" onClick={onClose} className="inline-block mt-4 bg-primary text-primary-foreground px-6 py-3 font-bold tap">تسوقي الآن</Link>
            </div>
          )}
          {items.map((i) => (
            <div key={i.id + (i.size || "")} className="flex gap-3 bg-card p-2 border border-border">
              <img src={resolveImg(i.image_url)} alt={i.name_ar} className="w-20 h-24 object-cover" />
              <div className="flex-1 flex flex-col justify-between text-sm">
                <div className="line-clamp-2">{i.name_ar}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">قطعة واحدة (فريدة)</span>
                  <div className="text-primary font-bold">{i.price.toFixed(2)} د.أ</div>
                </div>
              </div>
              <button onClick={() => remove(i.id, i.size)} aria-label="حذف" className="text-muted-foreground hover:text-primary self-start tap p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <footer className="border-t border-border p-4 pb-safe space-y-3 bg-card">
            <div className="flex justify-between text-sm"><span>المجموع الجزئي</span><span>{subtotal.toFixed(2)} د.أ</span></div>
            <div className="flex justify-between text-sm"><span>الشحن</span><span>{shipping === 0 ? "مجاناً" : `${shipping.toFixed(2)} د.أ`}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border"><span>المجموع</span><span className="text-primary">{total.toFixed(2)} د.أ</span></div>
            <Link to="/checkout" onClick={onClose} className="block text-center bg-primary text-primary-foreground py-3.5 font-bold hover:bg-primary/90 transition tap">
              إتمام الطلب — الدفع عند الاستلام
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}
