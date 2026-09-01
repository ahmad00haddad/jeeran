import { useCallback, useEffect, useState } from "react";
import { HelpCircle, X, ChevronLeft, ChevronRight } from "lucide-react";

type Step = {
  target?: string;
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    title: "أهلاً فيك بجيران 👋",
    body: "جيران سوق أردني للملابس المحتشمة المستعملة النظيفة. خليني آخذك بجولة سريعة — أقل من دقيقة.",
  },
  {
    target: '[data-tour="search"]',
    title: "دوّر على القطعة",
    body: "اكتب نوع القطعة، اللون، أو المقاس — مثلاً «عباية سوداء» أو «فستان سهرة».",
  },
  {
    target: '[data-tour="categories"]',
    title: "تصفّح الأقسام",
    body: "عبايات، حجابات، فساتين، ثياب رجالي، أطفال وإكسسوارات — كلها بضغطة.",
  },
  {
    target: '[data-tour="product"]',
    title: "كل قطعة وحيدة",
    body: "ما في مقاسات متعددة ولا كميات — كل قطعة موجودة مرة وحدة بس. إذا عجبتك احجزها بسرعة، وفي قطع متاحة للإيجار كمان.",
  },
  {
    target: '[data-tour="wishlist"]',
    title: "المفضلة",
    body: "احفظ القطع اللي عجبتك بقلب واحد وارجع لها وقت ما بدك.",
  },
  {
    target: '[data-tour="cart"]',
    title: "السلة والدفع",
    body: "من السلة بتكمّل الطلب باسمك ورقمك وعنوانك. الدفع كاش عند الاستلام — بدون بطاقة.",
  },
  {
    title: "تابع طلبك بأي وقت",
    body: "بعد الطلب بتوصلك رقم الطلب، وبتقدر تتابع حالته من صفحة «تتبّع الطلب». وأي استفسار راسلنا على واتساب.",
  },
];

const KEY = "jeeran_tour_v1";

function useRect(selector?: string, tick = 0) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  useEffect(() => {
    if (!selector) { setRect(null); return; }
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) { setRect(null); return; }
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    const measure = () => setRect(el.getBoundingClientRect());
    measure();
    const t = setTimeout(measure, 420);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [selector, tick]);
  return rect;
}

export function TourGuide() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        const t = setTimeout(() => setOpen(true), 1200);
        return () => clearTimeout(t);
      }
    } catch { /* ignore */ }
  }, []);

  const finish = useCallback(() => {
    setOpen(false);
    setI(0);
    try { localStorage.setItem(KEY, "done"); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") finish(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, finish]);

  const step = STEPS[i];
  const rect = useRect(open ? step?.target : undefined, tick);

  const start = () => { setI(0); setTick((t) => t + 1); setOpen(true); };
  const next = () => (i < STEPS.length - 1 ? setI(i + 1) : finish());
  const prev = () => setI(Math.max(0, i - 1));

  const pad = 8;
  const spotlight = rect
    ? {
        top: Math.max(4, rect.top - pad),
        insetInlineStart: Math.max(4, rect.left - pad),
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : null;

  const placeBelow = rect ? rect.top < window.innerHeight / 2 : true;

  return (
    <>
      {!open && (
        <button
          onClick={start}
          aria-label="جولة تعريفية بالموقع"
          className="fixed z-40 bottom-20 md:bottom-6 start-4 flex items-center gap-2 rounded-full bg-primary text-primary-foreground shadow-lg ps-3 pe-4 py-2.5 text-sm font-bold hover:brightness-110 transition tap"
        >
          <HelpCircle className="w-5 h-5" />
          <span>كيف بستخدم الموقع؟</span>
        </button>
      )}

      {open && step && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="جولة تعريفية">
          {/* dimmer + spotlight */}
          {spotlight ? (
            <div
              className="absolute rounded-xl ring-2 ring-gold pointer-events-none transition-all duration-300"
              style={{ ...spotlight, boxShadow: "0 0 0 9999px rgba(0,0,0,0.72)" }}
            />
          ) : (
            <div className="absolute inset-0 bg-black/70" />
          )}
          <button className="absolute inset-0 cursor-default" aria-label="إغلاق الجولة" onClick={finish} />

          {/* card */}
          <div
            className="absolute inset-x-4 md:inset-x-auto md:w-[420px] max-w-[calc(100vw-2rem)] bg-card text-card-foreground border border-gold/40 rounded-2xl shadow-2xl p-5 transition-all duration-300"
            style={
              rect
                ? placeBelow
                  ? { top: Math.min(rect.bottom + 16, window.innerHeight - 220) }
                  : { top: Math.max(16, rect.top - 216) }
                : { top: "50%", transform: "translateY(-50%)" }
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="eyebrow mb-1">خطوة {i + 1} من {STEPS.length}</div>
                <h2 className="font-display text-xl font-bold text-primary">{step.title}</h2>
              </div>
              <button onClick={finish} aria-label="إغلاق" className="p-1 text-muted-foreground hover:text-foreground tap">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">{step.body}</p>

            <div className="mt-4 flex items-center gap-1.5">
              {STEPS.map((_, n) => (
                <span
                  key={n}
                  className={`h-1.5 rounded-full transition-all ${n === i ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
                />
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <button onClick={finish} className="text-xs text-muted-foreground hover:text-foreground tap">
                تخطّي الجولة
              </button>
              <div className="flex items-center gap-2">
                {i > 0 && (
                  <button
                    onClick={prev}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-2 text-sm font-medium tap"
                  >
                    <ChevronRight className="w-4 h-4" />
                    السابق
                  </button>
                )}
                <button
                  onClick={next}
                  className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-bold hover:brightness-110 transition tap"
                >
                  {i === STEPS.length - 1 ? "تمام، خلصنا" : "التالي"}
                  {i < STEPS.length - 1 && <ChevronLeft className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
