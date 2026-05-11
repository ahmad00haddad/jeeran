import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { TopBar } from "@/components/jeeran/TopBar";
import { Header } from "@/components/jeeran/Header";
import { Footer } from "@/components/jeeran/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Plus, Package, ShoppingCart, Trash2, TrendingUp, DollarSign, Users, Clock } from "lucide-react";

export const Route = createFileRoute("/admin")({ component: Admin });

const CONDITIONS = [
  { v: "new", l: "جديد بالعلاقة" },
  { v: "like_new", l: "كالجديد" },
  { v: "worn_once", l: "ملبوس مرة" },
  { v: "gently_used", l: "بحالة ممتازة" },
];

function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<"stats" | "products" | "orders">("stats");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name_ar: "", brand: "", price: "", original_price: "", sale_price: "",
    image_url: "", category_id: "", condition: "like_new",
    description_ar: "", seller_notes: "", stock: "1",
  });

  useEffect(() => {
    if (isAdmin) {
      supabase.from("products").select("*").order("created_at", { ascending: false }).limit(500).then(({ data }) => setProducts(data || []));
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(500).then(({ data }) => setOrders(data || []));
      supabase.from("categories").select("*").order("display_order").then(({ data }) => setCats(data || []));
    }
  }, [isAdmin]);

  const stats = useMemo(() => {
    const total = orders.reduce((s, o) => s + Number(o.total || 0), 0);
    const pending = orders.filter((o) => o.status === "pending").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter((o) => new Date(o.created_at) >= today);
    const lowStock = products.filter((p) => Number(p.stock) <= 1);
    return { total, pending, delivered, todayCount: todayOrders.length, todayRevenue: todayOrders.reduce((s, o) => s + Number(o.total || 0), 0), lowStock: lowStock.length };
  }, [orders, products]);

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
      brand: form.brand || null,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      image_url: form.image_url || "/src/assets/p1.jpg",
      category_id: form.category_id || null,
      condition: form.condition,
      description_ar: form.description_ar,
      seller_notes: form.seller_notes,
      stock: Number(form.stock),
    });
    if (error) toast.error(error.message);
    else {
      toast.success("تم إضافة القطعة");
      setShowForm(false);
      setForm({ name_ar: "", brand: "", price: "", original_price: "", sale_price: "", image_url: "", category_id: "", condition: "like_new", description_ar: "", seller_notes: "", stock: "1" });
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
    if (!confirm("متأكد؟")) return;
    await supabase.from("products").delete().eq("id", id);
    setProducts((p) => p.filter((x) => x.id !== id));
    toast.success("تم الحذف");
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar /><Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-6">لوحة إدارة جيران</h1>
        <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
          <button onClick={() => setTab("stats")} className={`px-4 py-2 font-bold whitespace-nowrap ${tab === "stats" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}><TrendingUp className="w-4 h-4 inline ml-1" /> الإحصائيات</button>
          <button onClick={() => setTab("products")} className={`px-4 py-2 font-bold whitespace-nowrap ${tab === "products" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}><Package className="w-4 h-4 inline ml-1" /> القطع ({products.length})</button>
          <button onClick={() => setTab("orders")} className={`px-4 py-2 font-bold whitespace-nowrap ${tab === "orders" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}><ShoppingCart className="w-4 h-4 inline ml-1" /> الطلبات ({orders.length})</button>
        </div>

        {tab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={<DollarSign />} label="إجمالي المبيعات" value={`${stats.total.toFixed(2)} د.أ`} />
              <StatCard icon={<ShoppingCart />} label="مبيعات اليوم" value={`${stats.todayRevenue.toFixed(2)} د.أ`} sub={`${stats.todayCount} طلب`} />
              <StatCard icon={<Clock />} label="طلبات بانتظار" value={String(stats.pending)} highlight={stats.pending > 0} />
              <StatCard icon={<Users />} label="طلبات تمت" value={String(stats.delivered)} />
              <StatCard icon={<Package />} label="إجمالي القطع" value={String(products.length)} />
              <StatCard icon={<TrendingUp />} label="مخزون منخفض" value={String(stats.lowStock)} highlight={stats.lowStock > 0} />
            </div>
            <div className="bg-card border border-border p-5">
              <h3 className="font-bold mb-3">آخر ٥ طلبات</h3>
              <div className="space-y-2">
                {orders.slice(0, 5).map((o) => (
                  <div key={o.id} className="flex items-center justify-between text-sm border-b border-border/50 pb-2">
                    <div><span className="font-bold text-primary">{o.order_number}</span> — {o.full_name}</div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("ar-JO")}</span>
                      <span className="font-bold">{Number(o.total).toFixed(2)} د.أ</span>
                      <StatusBadge status={o.status} />
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <div className="text-sm text-muted-foreground">ما في طلبات لحد الآن.</div>}
              </div>
            </div>
          </div>
        )}

        {tab === "products" && (
          <>
            <button onClick={() => setShowForm(!showForm)} className="bg-primary text-primary-foreground px-4 py-2 font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> قطعة جديدة</button>
            {showForm && (
              <form onSubmit={addProduct} className="bg-card border border-border p-4 mb-6 grid md:grid-cols-2 gap-3">
                <input required placeholder="اسم القطعة" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} className="border border-border px-3 py-2" />
                <input placeholder="البراند الأصلي (Zara, H&M...)" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="border border-border px-3 py-2" />
                <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="border border-border px-3 py-2 bg-cream">
                  <option value="">— الفئة —</option>
                  {cats.map((c) => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
                </select>
                <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className="border border-border px-3 py-2 bg-cream">
                  {CONDITIONS.map((c) => <option key={c.v} value={c.v}>{c.l}</option>)}
                </select>
                <input required type="number" step="0.01" placeholder="سعر البيع (د.أ)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border border-border px-3 py-2" />
                <input type="number" step="0.01" placeholder="السعر الأصلي بالمحل (اختياري)" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} className="border border-border px-3 py-2" />
                <input type="number" step="0.01" placeholder="سعر تخفيض إضافي (اختياري)" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} className="border border-border px-3 py-2" />
                <input type="number" placeholder="الكمية المتوفرة" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border border-border px-3 py-2" />
                <input placeholder="رابط الصورة" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="border border-border px-3 py-2 md:col-span-2" />
                <textarea placeholder="الوصف (المقاس، اللون، التفاصيل)" value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} className="border border-border px-3 py-2 md:col-span-2" rows={2} />
                <textarea placeholder="ملاحظات عن الحالة (مثل: ملبوس مرة وحدة بالعرس، بدون أي عيوب)" value={form.seller_notes} onChange={(e) => setForm({ ...form, seller_notes: e.target.value })} className="border border-border px-3 py-2 md:col-span-2" rows={2} />
                <button className="bg-primary text-primary-foreground py-2 font-bold md:col-span-2">حفظ القطعة</button>
              </form>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border bg-card">
                <thead className="bg-secondary"><tr><th className="p-2 text-right">الاسم</th><th className="p-2">البراند</th><th className="p-2">الحالة</th><th className="p-2">السعر</th><th className="p-2">الأصلي</th><th className="p-2">مخزون</th><th className="p-2">إجراءات</th></tr></thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="p-2">{p.name_ar}</td>
                      <td className="p-2 text-center text-xs">{p.brand || "—"}</td>
                      <td className="p-2 text-center text-xs">{CONDITIONS.find((c) => c.v === p.condition)?.l || "—"}</td>
                      <td className="p-2 text-center">{Number(p.price).toFixed(2)}</td>
                      <td className="p-2 text-center text-muted-foreground">{p.original_price ? Number(p.original_price).toFixed(2) : "—"}</td>
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
            {orders.length === 0 && <div className="text-center text-muted-foreground py-12">ما في طلبات بعد.</div>}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function StatCard({ icon, label, value, sub, highlight }: { icon: React.ReactNode; label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`p-4 border ${highlight ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <span className={`w-8 h-8 rounded-full flex items-center justify-center ${highlight ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"}`}>
          <span className="[&>svg]:w-4 [&>svg]:h-4">{icon}</span>
        </span>
        <span>{label}</span>
      </div>
      <div className="text-xl font-bold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { l: string; c: string }> = {
    pending: { l: "بانتظار", c: "bg-gold/20 text-gold-foreground" },
    confirmed: { l: "مؤكد", c: "bg-primary/20 text-primary" },
    shipped: { l: "بالطريق", c: "bg-deep/20 text-deep" },
    delivered: { l: "تم", c: "bg-green-100 text-green-800" },
    cancelled: { l: "ملغي", c: "bg-red-100 text-red-800" },
  };
  const s = map[status] || map.pending;
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${s.c}`}>{s.l}</span>;
}
