import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/jeeran/TopBar";
import { Header } from "@/components/jeeran/Header";
import { Footer } from "@/components/jeeran/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Plus, Package, ShoppingCart, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin")({ component: Admin });

function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name_ar: "", price: "", sale_price: "", image_url: "", category_id: "", badge: "", description_ar: "", stock: "50" });

  useEffect(() => {
    if (isAdmin) {
      supabase.from("products").select("*").order("created_at", { ascending: false }).limit(500).then(({ data }) => setProducts(data || []));
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200).then(({ data }) => setOrders(data || []));
      supabase.from("categories").select("*").order("display_order").then(({ data }) => setCats(data || []));
    }
  }, [isAdmin]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">...</div>;
  if (!user) { nav({ to: "/auth" }); return null; }
  if (!isAdmin) return (
    <div className="min-h-screen flex flex-col">
      <TopBar /><Header />
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">ممنوع الوصول</h1>
          <p className="text-muted-foreground mb-4">حسابك مش مسؤول. تواصل مع الإدارة لتفعيل الصلاحيات.</p>
          <Link to="/" className="text-primary font-bold">رجوع</Link>
        </div>
      </main>
      <Footer />
    </div>
  );

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("products").insert({
      name_ar: form.name_ar,
      price: Number(form.price),
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      image_url: form.image_url || "/src/assets/p1.jpg",
      category_id: form.category_id || null,
      badge: form.badge || null,
      description_ar: form.description_ar,
      stock: Number(form.stock),
    });
    if (error) toast.error(error.message);
    else {
      toast.success("تم إضافة المنتج");
      setShowForm(false);
      setForm({ name_ar: "", price: "", sale_price: "", image_url: "", category_id: "", badge: "", description_ar: "", stock: "50" });
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false }).limit(500);
      setProducts(data || []);
    }
  }

  async function updateOrderStatus(id: string, status: string) {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("تم التحديث"); setOrders((p) => p.map((o) => o.id === id ? { ...o, status } : o)); }
  }

  async function deleteProduct(id: string) {
    if (!confirm("متأكدة؟")) return;
    await supabase.from("products").delete().eq("id", id);
    setProducts((p) => p.filter((x) => x.id !== id));
    toast.success("تم الحذف");
  }

  return (
    <div className="min-h-screen">
      <TopBar /><Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-6">لوحة الإدارة — جيران</h1>
        <div className="flex gap-2 mb-6 border-b border-border">
          <button onClick={() => setTab("products")} className={`px-4 py-2 font-bold ${tab === "products" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}><Package className="w-4 h-4 inline ml-1" /> المنتجات ({products.length})</button>
          <button onClick={() => setTab("orders")} className={`px-4 py-2 font-bold ${tab === "orders" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}><ShoppingCart className="w-4 h-4 inline ml-1" /> الطلبات ({orders.length})</button>
        </div>

        {tab === "products" && (
          <>
            <button onClick={() => setShowForm(!showForm)} className="bg-primary text-primary-foreground px-4 py-2 font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> منتج جديد</button>
            {showForm && (
              <form onSubmit={addProduct} className="bg-card border border-border p-4 mb-6 grid md:grid-cols-2 gap-3">
                <input required placeholder="اسم المنتج" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className="border border-border px-3 py-2" />
                <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="border border-border px-3 py-2 bg-cream">
                  <option value="">— الفئة —</option>
                  {cats.map((c) => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
                </select>
                <input required type="number" step="0.01" placeholder="السعر (د.أ)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border border-border px-3 py-2" />
                <input type="number" step="0.01" placeholder="سعر التخفيض (اختياري)" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} className="border border-border px-3 py-2" />
                <input placeholder="رابط الصورة" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="border border-border px-3 py-2" />
                <input placeholder="شارة (تخفيض/جديد/حصري)" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="border border-border px-3 py-2" />
                <input type="number" placeholder="المخزون" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border border-border px-3 py-2" />
                <textarea placeholder="الوصف" value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} className="border border-border px-3 py-2 md:col-span-2" rows={2} />
                <button className="bg-primary text-primary-foreground py-2 font-bold md:col-span-2">حفظ</button>
              </form>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border bg-card">
                <thead className="bg-secondary"><tr><th className="p-2 text-right">الاسم</th><th className="p-2">السعر</th><th className="p-2">تخفيض</th><th className="p-2">مخزون</th><th className="p-2">إجراءات</th></tr></thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="p-2">{p.name_ar}</td>
                      <td className="p-2 text-center">{Number(p.price).toFixed(2)}</td>
                      <td className="p-2 text-center">{p.sale_price ? Number(p.sale_price).toFixed(2) : "—"}</td>
                      <td className="p-2 text-center">{p.stock}</td>
                      <td className="p-2 text-center">
                        <button onClick={() => deleteProduct(p.id)} className="text-primary hover:underline"><Trash2 className="w-4 h-4 inline" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "orders" && (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="bg-card border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div>
                    <span className="font-bold text-primary">{o.order_number}</span>
                    <span className="text-xs text-muted-foreground mr-3"> — {new Date(o.created_at).toLocaleString("ar-JO")}</span>
                  </div>
                  <div className="text-lg font-bold">{Number(o.total).toFixed(2)} د.أ</div>
                </div>
                <div className="text-sm grid md:grid-cols-3 gap-2 mb-3">
                  <div><strong>{o.full_name}</strong> — {o.phone}</div>
                  <div>{o.city} — {o.address}</div>
                  <div className="text-muted-foreground">{o.notes}</div>
                </div>
                <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)} className="border border-border px-3 py-1 text-sm bg-cream">
                  <option value="pending">قيد الانتظار</option>
                  <option value="confirmed">مؤكد</option>
                  <option value="shipped">في الطريق</option>
                  <option value="delivered">تم التسليم</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
