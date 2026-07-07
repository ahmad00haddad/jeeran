import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/jeeran/TopBar";
import { Header } from "@/components/jeeran/Header";
import { Footer } from "@/components/jeeran/Footer";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: Auth,
  head: () => ({ meta: [{ title: "دخول / تسجيل — جيران" }, { name: "description", content: "سجّلي دخولك أو أنشئي حساب جديد في جيران." }, { name: "robots", content: "noindex" }] }),
});

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name, phone }, emailRedirectTo: `${window.location.origin}/account` }
      });
      if (error) toast.error(error.message);
      else { toast.success("تم إنشاء الحساب! تأكدي من إيميلك."); navigate({ to: "/account" }); }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else { toast.success("أهلاً وسهلاً 🌹"); navigate({ to: "/account" }); }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar /><Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border p-8">
          <h1 className="font-display text-3xl font-bold text-center mb-2">{mode === "login" ? "أهلاً برجوعك" : "انضمي لعائلة جيران"}</h1>
          <p className="text-center text-muted-foreground text-sm mb-6">{mode === "login" ? "ادخلي لحسابك" : "احصلي على ١٠٪ خصم على أول طلب"}</p>
          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" required className="w-full border border-border px-3 py-3 focus:border-primary outline-none" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الموبايل" className="w-full border border-border px-3 py-3 focus:border-primary outline-none" />
              </>
            )}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" required className="w-full border border-border px-3 py-3 focus:border-primary outline-none" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" required minLength={6} className="w-full border border-border px-3 py-3 focus:border-primary outline-none" />
            <button disabled={loading} className="w-full bg-primary text-primary-foreground py-3 font-bold disabled:opacity-50">
              {loading ? "جارٍ..." : mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
            </button>
          </form>
          <div className="text-center mt-6 text-sm">
            {mode === "login" ? "ما عندك حساب؟" : "عندك حساب؟"}{" "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-primary font-bold hover:underline">
              {mode === "login" ? "أنشئي حساب" : "ادخلي"}
            </button>
          </div>
          <Link to="/" className="block text-center mt-4 text-muted-foreground text-xs hover:text-primary">← متابعة كزائر</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
