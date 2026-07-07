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

  async function signInWithGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error("تعذّر الدخول عبر Google");
    else if (!result.redirected) navigate({ to: "/account" });
  }

  async function forgotPassword() {
    if (!email) { toast.error("اكتبي إيميلك أولاً"); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) toast.error(error.message); else toast.success("بعثنالك رابط إعادة تعيين كلمة المرور على الإيميل.");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar /><Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border p-8">
          <h1 className="font-display text-3xl font-bold text-center mb-2">{mode === "login" ? "أهلاً برجوعك" : "انضمي لعائلة جيران"}</h1>
          <p className="text-center text-muted-foreground text-sm mb-6">{mode === "login" ? "ادخلي لحسابك" : "احصلي على ١٠٪ خصم على أول طلب"}</p>

          <button type="button" onClick={signInWithGoogle} className="w-full flex items-center justify-center gap-2 border border-border py-3 font-bold hover:bg-secondary transition mb-4">
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.6 2.4-7.2 2.4-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C41.4 34.9 44 30 44 24c0-1.2-.1-2.3-.4-3.5z"/></svg>
            الدخول بحساب Google
          </button>

          <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" /> أو <div className="flex-1 h-px bg-border" />
          </div>

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
          {mode === "login" && (
            <button type="button" onClick={forgotPassword} className="block w-full text-center mt-3 text-sm text-primary hover:underline">
              نسيت كلمة المرور؟
            </button>
          )}
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
