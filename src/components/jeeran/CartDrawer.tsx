import { useEffect, useState } from "react";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart, cartTotals } from "@/store/cart";
import { resolveImg } from "@/lib/imageMap";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, remove } = useCart();
  const { subtotal, shipping, total, count } = cartTotals(items);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="absolute top-0 left-0 h-full w-full max-w-md bg-cream flex flex-col shadow-2xl">
        <header className="flex items-center justify-between p-4 border-b border-border bg-deep text-cream">
          <div className="flex items-center gap-2 font-bold">
            <ShoppingBag className="w-5 h-5" /> سلة المشتريات ({count})
          </div>
          <button onClick={onClose} className="p-1 hover:text-gold"><X /></button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <ShoppingBag className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p>السلة فاضية يا حلوة</p>
              <Link to="/shop" onClick={onClose} className="inline-block mt-4 bg-primary text-primary-foreground px-6 py-2 font-bold">تسوقي الآن</Link>
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
              <button onClick={() => remove(i.id, i.size)} className="text-muted-foreground hover:text-primary self-start"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <footer className="border-t border-border p-4 space-y-3 bg-card">
            <div className="flex justify-between text-sm"><span>المجموع الجزئي</span><span>{subtotal.toFixed(2)} د.أ</span></div>
            <div className="flex justify-between text-sm"><span>الشحن</span><span>{shipping === 0 ? "مجاناً" : `${shipping.toFixed(2)} د.أ`}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border"><span>المجموع</span><span className="text-primary">{total.toFixed(2)} د.أ</span></div>
            <Link to="/checkout" onClick={onClose} className="block text-center bg-primary text-primary-foreground py-3 font-bold hover:bg-primary/90 transition">
              إتمام الطلب — الدفع عند الاستلام
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}
