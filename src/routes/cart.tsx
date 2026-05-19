import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { TopBar } from "@/components/jeeran/TopBar";
import { Header } from "@/components/jeeran/Header";
import { Footer } from "@/components/jeeran/Footer";
import { MobileNav } from "@/components/jeeran/MobileNav";
import { useCart, cartTotals } from "@/store/cart";
import { resolveImg } from "@/lib/imageMap";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const { items, setQty, remove } = useCart();
  const { subtotal, shipping, total } = cartTotals(items);

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <TopBar /><Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-6">سلتي ({items.length})</h1>
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">سلتك فاضية</p>
            <Link to="/shop" className="bg-primary text-primary-foreground px-8 py-3 font-bold">تسوقي الآن</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              {items.map((i) => (
                <div key={i.id + (i.size || "")} className="flex gap-4 bg-card p-3 border border-border">
                  <img src={resolveImg(i.image_url)} alt={i.name_ar} className="w-24 h-28 object-cover" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium">{i.name_ar}</h3>
                      {i.size && <div className="text-xs text-muted-foreground">المقاس: {i.size}</div>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">قطعة واحدة (فريدة)</span>
                      <span className="font-bold text-primary">{(i.price * i.quantity).toFixed(2)} د.أ</span>
                    </div>
                  </div>
                  <button onClick={() => remove(i.id, i.size)} className="self-start text-muted-foreground hover:text-primary"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <aside className="bg-card p-6 border border-border h-fit space-y-3">
              <div className="flex justify-between"><span>المجموع الجزئي</span><span>{subtotal.toFixed(2)} د.أ</span></div>
              <div className="flex justify-between"><span>الشحن</span><span>{shipping === 0 ? "مجاناً" : `${shipping.toFixed(2)} د.أ`}</span></div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t border-border"><span>الإجمالي</span><span className="text-primary">{total.toFixed(2)} د.أ</span></div>
              <Link to="/checkout" className="block text-center bg-primary text-primary-foreground py-3 font-bold mt-3">إتمام الطلب</Link>
            </aside>
          </div>
        )}
      </main>
      <Footer /><MobileNav />
    </div>
  );
}
