import { Logo } from "./Logo";
import { Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-deep text-cream pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 pb-8 border-b border-cream/10">
          <div className="space-y-4">
            <Logo className="text-cream" />
            <p className="text-sm text-cream/70 leading-relaxed">
              سوق أردني للملابس المحتشمة المستعملة — قطع نظيفة بسعر يناسب جيبك.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:bg-gold hover:text-gold-foreground hover:border-gold transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:bg-gold hover:text-gold-foreground hover:border-gold transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:bg-gold hover:text-gold-foreground hover:border-gold transition">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gold text-sm tracking-wider">تسوّقي</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li><a href="#" className="hover:text-cream">عبايات</a></li>
              <li><a href="#" className="hover:text-cream">حجابات</a></li>
              <li><a href="#" className="hover:text-cream">فساتين طويلة</a></li>
              <li><a href="#" className="hover:text-cream">رجالي</a></li>
              <li><a href="#" className="hover:text-cream">أطفال</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gold text-sm tracking-wider">خدمة العملاء</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li><a href="#" className="hover:text-cream">الشحن والتوصيل</a></li>
              <li><a href="#" className="hover:text-cream">الإرجاع والاستبدال</a></li>
              <li><a href="#" className="hover:text-cream">جدول القياسات</a></li>
              <li><a href="#" className="hover:text-cream">طرق الدفع</a></li>
              <li><a href="#" className="hover:text-cream">تواصلي معنا</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gold text-sm tracking-wider">اشتركي بالنشرة</h4>
            <p className="text-sm text-cream/70 mb-3">احصلي على ١٠٪ خصم على أوّل طلب</p>
            <div className="flex">
              <input type="email" placeholder="بريدك الإلكتروني" className="flex-1 bg-cream/10 border border-cream/20 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
              <button className="bg-primary text-primary-foreground px-5 text-sm font-bold hover:bg-gold hover:text-gold-foreground transition">اشتركي</button>
            </div>
            <div className="mt-6 text-xs text-cream/60 leading-relaxed">
              📍 الزرقاء، الأردن<br />
              ☎ ٠٧٩ ١٢٣ ٤٥٦٧
            </div>
          </div>
        </div>
        <div className="pt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-cream/50">
          <span>© ٢٠٢٥ جيران — سوق الملابس المستعملة الأردني</span>
          <span className="text-gold">ملابسك القديمة إلها قيمة ✦</span>
        </div>
      </div>
    </footer>
  );
}
