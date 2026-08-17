import { Logo } from "./Logo";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-deep text-cream pt-14 pb-6 grain-strong">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8 pb-8 border-b border-cream/10">
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
              <li><Link to="/shop" className="hover:text-cream">عبايات</Link></li>
              <li><Link to="/shop" className="hover:text-cream">حجابات</Link></li>
              <li><Link to="/shop" className="hover:text-cream">فساتين طويلة</Link></li>
              <li><Link to="/shop" className="hover:text-cream">رجالي</Link></li>
              <li><Link to="/shop" className="hover:text-cream">أطفال</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gold text-sm tracking-wider">خدمة العملاء</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li><Link to="/shipping" className="hover:text-cream">الشحن والتوصيل</Link></li>
              <li><Link to="/returns" className="hover:text-cream">الإرجاع والاستبدال</Link></li>
              <li><Link to="/about" className="hover:text-cream">من نحن</Link></li>
              <li><Link to="/contact" className="hover:text-cream">تواصلي معنا</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gold text-sm tracking-wider">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li><Link to="/shop" className="hover:text-cream">تسوّقي الآن</Link></li>
              <li><Link to="/track" className="hover:text-cream">تتبّعي طلبك</Link></li>
              <li><Link to="/cart" className="hover:text-cream">سلة المشتريات</Link></li>
              <li><Link to="/wishlist" className="hover:text-cream">المفضلة</Link></li>
              <li><Link to="/install" className="hover:text-cream">تثبيت التطبيق</Link></li>
              <li><Link to="/terms" className="hover:text-cream">الشروط والأحكام</Link></li>
              <li><Link to="/privacy" className="hover:text-cream">سياسة الخصوصية</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gold text-sm tracking-wider">اشتركي بالنشرة</h4>
            <p className="text-sm text-cream/70 mb-3">احصلي على ١٠٪ خصم على أوّل طلب</p>
            <div className="flex">
              <input type="email" placeholder="بريدك الإلكتروني" className="flex-1 bg-background/10 border border-cream/20 px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
              <button className="bg-primary text-primary-foreground px-5 text-sm font-bold hover:bg-gold hover:text-gold-foreground transition">اشتركي</button>
            </div>
            <div className="mt-6 text-xs text-cream/60 leading-relaxed" dir="ltr">
              📍 الزرقاء، الأردن<br />
              <a href="https://wa.me/962799256345" className="hover:text-gold">☎ +962 79 925 6345</a>
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
