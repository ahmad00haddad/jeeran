import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/jeeran/TopBar";
import { Header } from "@/components/jeeran/Header";
import { Footer } from "@/components/jeeran/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
  head: () => ({ meta: [{ title: "إعادة تعيين كلمة المرور — جيران" }, { name: "description", content: "اختاري كلمة مرور جديدة لحسابك في جيران." }, { name: "robots", content: "noindex" }] }),
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("تم تحديث كلمة المرور 🌹"); navigate({ to: "/account" }); }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar /><Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border p-8">
          <h1 className="font-display text-2xl font-bold text-center mb-6">كلمة مرور جديدة</h1>
          <form onSubmit={submit} className="space-y-3">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور الجديدة" required minLength={6} className="w-full border border-border px-3 py-3 focus:border-primary outline-none" />
            <button disabled={loading} className="w-full bg-primary text-primary-foreground py-3 font-bold disabled:opacity-50">
              {loading ? "جارٍ..." : "تحديث كلمة المرور"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
