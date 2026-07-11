import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopBar } from "@/components/jeeran/TopBar";
import { Header } from "@/components/jeeran/Header";
import { Footer } from "@/components/jeeran/Footer";
import { Smartphone, Share2, PlusSquare, Download, CheckCircle2, Monitor } from "lucide-react";

export const Route = createFileRoute("/install")({
  component: InstallPage,
  head: () => ({
    meta: [
      { title: "تثبيت تطبيق جيران — إضافة إلى الشاشة الرئيسية" },
      { name: "description", content: "تعلّمي كيفية تنزيل تطبيق جيران على جوالك (آيفون أو أندرويد) لتصفّح أسهل وأسرع." },
    ],
  }),
});

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function InstallPage() {
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop" | "unknown">("unknown");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    if (isIos) setPlatform("ios");
    else if (isAndroid) setPlatform("android");
    else if ("standalone" in window.navigator || window.matchMedia("(display-mode: standalone)").matches) setPlatform("desktop");
    else setPlatform("desktop");

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true) {
      setInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function triggerInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />
      <main className="flex-1 grain-paper py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">ثبّتي جيران على جوالك</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              استمتعي بتجربة أسرع وأقرب لتطبيقنا من خلال إضافة جيران إلى الشاشة الرئيسية — بدون تحميل من المتجر.
            </p>
          </div>

          {installed && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-8 flex items-center gap-3 justify-center">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-medium">التطبيق مثبّت بالفعل على جهازك 🎉</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className={`bg-card border p-6 ${platform === "ios" ? "border-primary ring-1 ring-primary/20" : "border-border"}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-display text-xl font-bold">على آيفون / آيباد</h2>
              </div>
              <ol className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-bold text-primary">1</span>
                  <span>افتحي موقع جيران من متصفح <strong>Safari</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">2</span>
                  <span>اضغطي على زر <strong>المشاركة</strong> <Share2 className="inline w-4 h-4 mx-1 align-text-bottom" /> في الأسفل أو الأعلى.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">3</span>
                  <span>اختاري <strong>إضافة إلى الشاشة الرئيسية</strong> <PlusSquare className="inline w-4 h-4 mx-1 align-text-bottom" />.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">4</span>
                  <span>اضغطي <strong>إضافة</strong>، وستجدين أيقونة جيران مع بقية التطبيقات.</span>
                </li>
              </ol>
            </div>

            <div className={`bg-card border p-6 ${platform === "android" ? "border-primary ring-1 ring-primary/20" : "border-border"}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-display text-xl font-bold">على أندرويد</h2>
              </div>
              <ol className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-bold text-primary">1</span>
                  <span>افتحي موقع جيران من متصفح <strong>Chrome</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">2</span>
                  <span>اضغطي على قائمة النقاط الثلاث <span className="inline-block rotate-90">⋯</span> في الأعلى.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">3</span>
                  <span>اختاري <strong>تثبيت التطبيق</strong> أو <strong>إضافة إلى الشاشة الرئيسية</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">4</span>
                  <span>اضغطي <strong>تثبيت</strong>، وستظهر أيقونة جيران على الشاشة الرئيسية.</span>
                </li>
              </ol>

              {platform === "android" && deferredPrompt && !installed && (
                <button
                  onClick={triggerInstall}
                  className="mt-6 w-full bg-primary text-primary-foreground py-2.5 font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition"
                >
                  <Download className="w-4 h-4" />
                  ثبّتي الآن
                </button>
              )}
            </div>
          </div>

          <div className="bg-card border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <Monitor className="w-5 h-5 text-gold" />
              </div>
              <h2 className="font-display text-xl font-bold">على الكمبيوتر</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              في متصفح Chrome أو Edge على الكمبيوتر، اضغطي على أيقونة التثبيت <Download className="inline w-4 h-4 mx-1 align-text-bottom" /> بجانب شريط العنوان، ثم اختاري <strong>تثبيت</strong>.
            </p>
            <p className="text-sm text-muted-foreground">
              بعد التثبيت، يفتح الموقع كتطبيق مستقل بدون شريط المتصفح، لتجربة أسرع وأنظف.
            </p>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            هل واجهتِ مشكلة في التثبيت؟ تواصلي معنا عبر واتساب وسنساعدك مباشرة.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
