# خطة "المستخدم العشوائي" — تحصين تجربة المستخدم

هدف الخطة: نفترض أن المستخدم يضغط كل شيء بشكل عشوائي، ما بيقرأ، وممكن يكبس نفس الزر 20 مرة أو يقفل ويرجع أو يفتح 5 تبويبات. نضيف حواجز أمان + رسائل واضحة + منع كوارث.

## المشاكل المكتشفة (Audit)

### 1) الطلبات (Checkout)
- زر "تأكيد الطلب" غير محمي من الدبل-كليك بشكل مرئي (submitting=true بس، بس المستخدم ممكن يضغط قبل ما يتغير state).
- إذا صار خطأ بعد الضغط، المستخدم بيرجع لـstep 2 بدون توضيح كافي أي قطعة انباعت.
- ما في تأكيد "متأكدة إنك بدك تأكدي الطلب؟" — الضغطة النهائية بلا رجعة.
- رقم الموبايل: لو المستخدم كتب مسافات/رموز عربية/+962، ما في تنظيف تلقائي (بس regex validation).
- الاسم والعنوان: ما في حد أدنى (ممكن يكتب "a") ولا trim للفراغات.

### 2) السلة (Cart)
- زر "حذف" فوري بدون تأكيد — لو ضغطت غلط راحت القطعة (بدون Undo).
- لو القطعة انباعت وهي بالسلة، ما في تحذير قبل الـcheckout (بس بيظهر بعد الضغط).

### 3) صفحة المنتج
- زر "أضيفي للسلة" ممكن يُضغط عدة مرات — منطقياً بيبقى قطعة واحدة، بس ما في feedback واضح "موجودة أصلاً بالسلة".
- زر واتساب/عرض سعر/حجز 24س: لو ضغط بسرعة على offer وrental dialog، ممكن يفتحوا فوق بعض.
- OfferDialog & RentalDialog: التاتش خارج الديالوج بيقفله فوراً حتى لو المستخدم عبّى بيانات — بيفقد كل شي.
- OfferDialog: ما في حد أقصى/أدنى منطقي للسعر المعروض (ممكن يكتب 1 د.أ لفستان 200).

### 4) المفضلة / Wishlist
- toggleWish بدون feedback (بيتبدل بصمت) — المستخدم ما بيعرف صار شو.

### 5) الأدمن / نماذج الإدخال
- ما في تأكيد قبل الحذف (خطر مسح منتج بالغلط).
- ما في حماية من الخروج من الصفحة وفيها تغييرات غير محفوظة (beforeunload).

### 6) عام
- ما في Error Boundary مرئي بالعربي لو انهار component (بيطلع صفحة إنجليزية من `error-page.ts`).
- 404: ما في route للـcatch-all بالعربي.
- الروابط المكسورة بالفوتر/الهيدر: ما تم فحصها.
- الفورمز كلها: لو المستخدم ضغط Enter بلا تعبئة، سلوك غير موحّد.
- Loading states: بعض الأزرار ما بتتعطل خلال العملية (double-submit risk).

### 7) Session / Auth
- المستخدم عمل login وفتح صفحة admin بدون صلاحية — بيشوف شو؟ (لازم نتأكد من route guard).
- Logout بدون تأكيد.

---

## الحلول المقترحة (Fixes)

### أولوية عالية (Blockers لتجربة سليمة)

1. **Confirm Dialog قبل العمليات الحساسة**
   - إضافة `<ConfirmDialog>` مشترك (يستخدم shadcn AlertDialog).
   - يُستخدم في: حذف من السلة، حذف منتج (أدمن)، تسجيل خروج، تأكيد الطلب النهائي.

2. **حماية Double-submit شاملة**
   - كل زر submit: `disabled={submitting}` + عرض spinner + منع click handler ثاني.
   - نطبّقها على: Checkout، OfferDialog، RentalDialog، Admin forms.

3. **تنظيف مدخلات الهاتف والاسم تلقائياً**
   - عند blur: `trim()`، إزالة مسافات من الهاتف، تحويل الأرقام العربية إلى إنجليزية.
   - رسالة inline خضراء عند صحة الرقم (feedback إيجابي).

4. **Toast + Undo عند حذف من السلة**
   - `toast.success("انحذفت", { action: { label: "تراجع", onClick: restore }})`.

5. **فحص توفر القطع قبل فتح Checkout**
   - عند دخول `/checkout`: query سريع للـsold/reserved status لكل قطعة بالسلة، وإزالة/تحذير قبل ما يعبّي البيانات.

6. **OfferDialog / RentalDialog: منع القفل الخاطئ**
   - الضغط خارج الديالوج ما بيقفل إذا فيه بيانات مكتوبة — بدل هيك، يظهر confirm صغير "متأكدة تتركي بدون إرسال؟".
   - Escape key نفس السلوك.

7. **Feedback واضح للـwishlist**
   - toast قصير: "انضافت للمفضلة ❤️" / "انشالت من المفضلة".

### أولوية متوسطة

8. **صفحة 404 عربية**
   - `src/routes/__root.tsx` notFoundComponent بالعربي مع زر رجوع للرئيسية.

9. **Error Boundary عربي**
   - تحديث `renderErrorPage()` لعرض رسالة عربية مع زر تحديث ورقم واتساب للتواصل.

10. **حماية الأدمن**
    - `src/routes/admin.tsx`: التأكد من redirect للمستخدم غير المصرح (لو الآن بيعرض بس رسالة، نضيف redirect لـ`/`).

11. **حدود منطقية على OfferDialog**
    - السعر المعروض >= 40% من السعر الحالي وإلا رسالة "العرض منخفض جداً، جرّبي سعر أقرب".

12. **beforeunload للنماذج الطويلة**
    - Checkout و Admin product form: تحذير عند إغلاق التاب/الرجوع لو فيه بيانات غير محفوظة.

13. **زر "موجودة بالسلة" بدل "أضيفي للسلة"**
    - بعد الإضافة: الزر يتحول لـ"موجودة بالسلة — روحي للسلة" (لتفادي الضغطات المكررة).

### أولوية منخفضة (Polish)

14. **تحسين رسائل الفشل**
    - كل catch/error: رسالة واضحة + زر "أعيدي المحاولة".

15. **منع فتح ديالوجين مع بعض**
    - state واحد `openDialog: "offer" | "rental" | "hold24h" | null` في PDP.

16. **رسائل تحذيرية للسلوك الغريب**
    - لو المستخدم بيضغط نفس الزر خلال ثانية 3 مرات: toast "خذي نفس، الطلب عم يتعالج ⏳".

---

## المراحل (Phased Roadmap)

### المرحلة 1 — Blockers (نبدأ فوراً)
- إنشاء `ConfirmDialog` مشترك.
- تطبيق Confirm + Undo على: حذف السلة، تأكيد الطلب، حذف الأدمن، تسجيل الخروج.
- Double-submit protection على كل الأزرار الحساسة.
- تنظيف مدخلات الهاتف/الاسم تلقائياً.
- فحص توفر قطع السلة عند دخول الـcheckout.

### المرحلة 2 — تحسين الديالوجات والـFeedback
- إصلاح إغلاق OfferDialog/RentalDialog عن غير قصد.
- Toast feedback للـwishlist.
- زر "موجودة بالسلة" بعد الإضافة.
- حدود منطقية على العروض.
- state موحّد للديالوجات في PDP.

### المرحلة 3 — صفحات الأخطاء والحماية
- 404 عربية + notFoundComponent.
- Error Boundary عربي.
- Route guard حقيقي للأدمن.
- beforeunload للنماذج الطويلة.

### المرحلة 4 — Polish
- رسائل خطأ محسّنة + أزرار retry.
- تحذيرات spam-click.
- مراجعة عامة لكل زر بالموقع.

---

## التفاصيل التقنية (للمطور)

- **ConfirmDialog جديد**: `src/components/ui/confirm-dialog.tsx` باستخدام shadcn AlertDialog، يستقبل `{ title, description, confirmLabel, onConfirm, variant }`.
- **Hook للـform dirty**: `useBeforeUnload(isDirty)` في `src/hooks/`.
- **Cart availability check**: server function جديدة `check_cart_availability(_ids: uuid[])` تُرجع الـsold/reserved لكل id — أو استعلام مباشر عبر `supabase.from("products").select("id,sold,reserved_until").in("id", ids)`.
- **Phone normalizer**: `src/lib/phone.ts` يحوّل الأرقام العربية `٠١٢...` لإنجليزية ويزيل +962/00962.
- **notFoundComponent**: على مستوى `__root.tsx` route.
- **Route guard admin**: `useAuth()` — لو `!isAdmin && !loading` → `navigate({to: "/"})`.

الملفات المتوقع تعديلها في المرحلة 1: `src/routes/cart.tsx`, `src/routes/checkout.tsx`, `src/routes/admin.tsx`, `src/components/jeeran/OfferDialog.tsx`, `src/components/jeeran/RentalDialog.tsx`, ملف ConfirmDialog جديد، `src/lib/phone.ts` جديد.

---

هل نبدأ بالمرحلة 1؟ أو تحبي نضيف/نحذف نقاط قبل ما نطبق؟
