# خطة: تحويل جيران لتجربة موبايل شبيهة بتطبيق أصلي (App-like PWA)

## الهدف
جعل النسخة المحمولة تُحسّ وكأنها تطبيق فعلي: تنقّل سفلي دائم، ترويسة مضغوطة، انتقالات ناعمة، إيماءات، وسلوك offline/standalone سلس — دون كسر تجربة سطح المكتب.

---

## 1) الأساسات (Shell & Safe Areas)
- إضافة دعم كامل لـ `env(safe-area-inset-*)` (خصوصًا iOS notch/home indicator) على:
  - `Header` (padding-top)
  - `MobileNav` (padding-bottom)
  - `CartDrawer` و `Dialog`s
- استخدام `100dvh` بدل `100vh` لمنع القفزات مع شريط المتصفح.
- كشف وضع standalone عبر `display-mode: standalone` وتفعيل ستايل خاص (إخفاء بانرات "ثبّت التطبيق"، شريط علوي أقصر).

## 2) الترويسة (Header) على الموبايل
- تصغير الارتفاع وإزالة أيقونات مكررة مع `MobileNav`:
  - إزالة أيقونات User/Wishlist/Cart من Header على الموبايل (موجودة أصلًا في التنقّل السفلي).
  - إبقاء: زر رجوع سياقي (عند صفحات داخلية) + الشعار + أيقونة بحث تفتح Overlay بحث فل-سكرين.
- Overlay بحث بملء الشاشة مع اقتراحات وتاريخ بحث.
- إخفاء `TopBar` على الموبايل (أو تحويله لشريط رفيع جدًا).

## 3) التنقّل السفلي (MobileNav)
- تصميم iOS/Android حديث: أيقونات أكبر، Label اختياري، Active pill/indicator متحرك.
- إضافة haptic feedback (Vibration API) عند التبديل.
- إخفاء تلقائي عند التمرير للأسفل، ظهور عند التمرير للأعلى (اختياري).
- تعديل الشارات (badges) لتكون أوضح.

## 4) انتقالات الصفحات (Page Transitions)
- استخدام View Transitions API (متاح على Chromium) مع fallback لـ Framer Motion لانتقالات slide/fade بين الطرق.
- انتقال خاص لصفحة المنتج (shared element على صورة المنتج).

## 5) صفحة المنتج (Product Detail)
- Gallery أفقي بالسحب (swipe) مع Dots + Pinch-to-zoom.
- Sticky bottom bar للسعر + زر "أضيفي للسلة" بدل زر داخل التدفق.
- Sheet سفلي (Bottom Sheet) لاختيار المقاس/اللون بدل Dropdown.

## 6) السلة والدفع (Cart/Checkout)
- تحويل `CartDrawer` على الموبايل إلى Bottom Sheet بسحب.
- Checkout بخطوات (Stepper) بملء الشاشة مع Sticky CTA.
- حقول إدخال أكبر (min-height 48px)، `inputMode` مناسب (`tel`, `numeric`), autofill.

## 7) قوائم المنتجات (Shop/Home)
- شبكة عمودين على الموبايل بمسافات مريحة، Skeletons أثناء التحميل.
- Sticky Filters chips أفقية قابلة للسحب.
- Filters يفتح كـ Bottom Sheet فل-هايت بدل Modal.
- Pull-to-refresh على الصفحة الرئيسية والمتجر.
- Infinite scroll بدل Pagination.

## 8) الإيماءات (Gestures)
- Swipe back للرجوع (via Framer Motion drag).
- Swipe to delete على عناصر السلة/المفضلة.
- Long press لمعاينة سريعة للمنتج (Quick View sheet).

## 9) الأداء والإحساس
- Lazy load صور + `content-visibility: auto` للأقسام.
- تعطيل hover states على الموبايل، تفعيل `:active` بحركة scale خفيفة (0.97).
- إزالة الـ tap highlight الأزرق (`-webkit-tap-highlight-color: transparent`).
- Font preload، تجنّب CLS بحجز أبعاد الصور.

## 10) Offline & PWA سلوك تطبيق
- إضافة Service Worker عبر `vite-plugin-pwa` (generateSW) مع NetworkFirst للـ HTML و CacheFirst للأصول الثابتة.
- صفحة Offline مخصصة.
- Splash screens لـ iOS (مجموعة صور بأحجام مختلفة).
- تحديث `manifest.webmanifest`: إضافة `shortcuts` (تسوّق/المفضلة/السلة)، `share_target` (اختياري)، `categories`.
- زر تحديث ذكي عند توفر نسخة جديدة (SW update prompt).

## 11) الطباعة والأحجام (Typography scale)
- سلّم أحجام أصغر على الموبايل + line-height أوسع.
- عناوين bold أكبر في صفحات المنتج والفواتير.

## 12) إخفاء شعار Lovable
- استدعاء `publish_settings--set_badge_visibility({ hide_badge: true })`.
- ملاحظة: يتطلب خطة Pro أو أعلى.

---

## الملفات المتوقع تعديلها/إضافتها

**تعديل:**
- `src/styles.css` — safe-area utilities, active states, tap highlight, dvh.
- `src/routes/__root.tsx` — SW registration guard, standalone detection.
- `src/components/jeeran/Header.tsx` — تبسيط للموبايل + Search Overlay.
- `src/components/jeeran/MobileNav.tsx` — إعادة تصميم + auto-hide.
- `src/components/jeeran/CartDrawer.tsx` — Bottom Sheet على الموبايل.
- `src/routes/product.$id.tsx` — Gallery swipe + sticky CTA.
- `src/routes/shop.tsx` + `shop.$slug.tsx` — Sticky chips + Bottom Sheet filters.
- `src/routes/checkout.tsx` — Stepper + inputs محسّنة.
- `public/manifest.webmanifest` — shortcuts + categories.

**إضافة:**
- `src/components/mobile/BottomSheet.tsx`
- `src/components/mobile/SearchOverlay.tsx`
- `src/components/mobile/PageTransition.tsx`
- `src/components/mobile/PullToRefresh.tsx`
- `src/hooks/useStandalone.ts`
- `src/hooks/useSwipeBack.ts`
- `src/pwa/register.ts` (مع حراسات preview/dev)
- `public/offline.html` + iOS splash images.

---

## تفاصيل تقنية

- **مكتبات مطلوبة:** `framer-motion` (موجودة غالبًا)، `vite-plugin-pwa`، `workbox-window`.
- **View Transitions:** استخدام `document.startViewTransition` مع fallback لـ Framer Motion لـ Safari.
- **Bottom Sheet:** بناء مخصص عبر Framer Motion drag على `y` مع snap points [0, 0.5, 1].
- **SW Guards:** عدم التسجيل في `preview--*.lovable.app` أو `id-preview--*` أو dev (حسب PWA skill).
- **Haptics:** `navigator.vibrate?.(10)` — لا يعمل على iOS Safari لكنه لا يكسر شيء.
- **Safe areas CSS:**
  ```css
  @supports (padding: env(safe-area-inset-top)) {
    .safe-top { padding-top: env(safe-area-inset-top); }
    .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
  }
  ```

---

## مراحل التنفيذ المقترحة (نطبّقها على دفعات)

1. **Phase 1 — الأساسات (سريع، أثر كبير):** safe-areas، dvh، tap highlight، active scale، تبسيط Header الموبايل، إعادة تصميم MobileNav، إخفاء شعار Lovable.
2. **Phase 2 — Sheets & Search:** Bottom Sheet component، تحويل CartDrawer و Filters، Search Overlay.
3. **Phase 3 — صفحة المنتج:** Gallery swipe، Sticky CTA، shared element transition.
4. **Phase 4 — Offline & PWA متقدم:** vite-plugin-pwa، offline page، shortcuts، update prompt، iOS splash.
5. **Phase 5 — Polish:** Page transitions، pull-to-refresh، swipe gestures، haptics.

---

## سؤال قبل البدء
هل تريد أن نبدأ بـ **Phase 1** مباشرة (أثر مرئي فوري)، أم تفضّل تنفيذ الخطة كاملة على دفعات متتالية دون توقف؟ وهل خطتك تدعم Pro (لإخفاء شعار Lovable)؟
