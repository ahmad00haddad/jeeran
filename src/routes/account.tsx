import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/jeeran/TopBar";
import { Header } from "@/components/jeeran/Header";
import { Footer } from "@/components/jeeran/Footer";
import { MobileNav } from "@/components/jeeran/MobileNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Package, LogOut, Shield } from "lucide-react";

export const Route = createFileRoute("/account")({ component: Account });

function Account() {
  const { user, isAdmin, loading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    if (user) supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => setOrders(data || []));
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar /><Header />
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <h1 className="text-2xl font-bold mb-4">سجلي دخولك</h1>
            <Link to="/auth" className="inline-block bg-primary text-primary-foreground px-8 py-3 font-bold">دخول / تسجيل</Link>
          </div>
        </main>
        <Footer /><MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <TopBar /><Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold">حسابي</h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
          <div className="flex gap-2">
            {isAdmin && <Link to="/admin" className="flex items-center gap-2 bg-gold text-gold-foreground px-4 py-2 font-bold"><Shield className="w-4 h-4" /> لوحة الإدارة</Link>}
            <button onClick={async () => { await supabase.auth.signOut(); nav({ to: "/" }); }} className="flex items-center gap-2 border border-border px-4 py-2"><LogOut className="w-4 h-4" /> خروج</button>
          </div>
        </div>

        <section>
          <h2 className="font-bold text-xl mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-primary" /> طلباتي ({orders.length})</h2>
          {orders.length === 0 ? (
            <div className="bg-card border border-border p-8 text-center text-muted-foreground">
              لسا ما عندك طلبات. <Link to="/shop" className="text-primary font-bold">ابدئي تسوّقي</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="bg-card border border-border p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-primary">{o.order_number}</div>
                    <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("ar-JO")}</div>
                  </div>
                  <div className="text-sm">{o.full_name} — {o.city}</div>
                  <span className={`text-xs font-bold px-3 py-1 ${o.status === "delivered" ? "bg-green-100 text-green-800" : o.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-gold/20 text-gold-foreground"}`}>{o.status}</span>
                  <div className="font-bold text-lg">{Number(o.total).toFixed(2)} د.أ</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer /><MobileNav />
    </div>
  );
}
