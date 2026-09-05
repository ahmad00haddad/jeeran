# Jiran: Heritage Style

Build a complete, production-ready e-commerce website exactly like Shein but for modest Islamic clothing (women: abayas, hijabs, long dresses, tops with sleeves; men: thobes, shirts, pants modest; kids: modest casual wear), targeted at Jordanian/Arab users. Theme: Traditional Arabic Heritage Jordanian style - dominant color #A2231D (rich Persian carpet red) for buttons, prices, headers, active elements; gold #D4AF37 accents for premium labels, icons; cream #F5F5DC backgrounds; subtle Arabic geometric Islamic patterns (non-figurative) as borders/backgrounds. Use Arabic fonts: Tajawal or Almarai for all text. Full RTL Arabic layout. Jordanian white Shami dialect in ALL text (examples: "وصل حديثاً يا ربيع" for New In, "الأكثر طلباً عندنا" for Trending, "أضف 10 د.أ آخرى لشحن مجاني!" for cart). All models: fully modest Islamic - women covered hijab/abaya, no skin shown; men modest shirts/pants; kids clean modest clothes. COD (Cash on Delivery) mandatory option, phone confirmation for COD orders.

**Backend: Use Supabase for database/auth/storage. Schema:**

- Categories: id, name_ar (e.g. 'عبايات', 'ثياب شباب'), parent_id for subcats.

- Products: id, name_ar, description_ar (detailed Jordanian style e.g. "عباية قطنية مريحة للصيف، مقاسات من S-XXL، قماش ناعم ما يلزق بالجسم"), price, sale_price, images[] (multiple, modest models), colors[], sizes[], stock_per_variant, category_id, created_by_admin.

- Orders: id, user_id, items[], total, status (pending/processing/shipped/delivered), shipping_address, payment_method (COD/card), phone_confirmed (for COD).

- Users: id, email, role (customer/admin), orders[].

- Admin_Users: separate table with login.

Real-time: Use Supabase realtime for order updates, stock.

**Full Shein-like Sections & Pages (simple, fast-loading, mobile-first):**

1. **Homepage (Shein-style simple & instant clothes):**

   - Hero banner: Rotating modest outfits with red CTA "تسوق الآن" (#A2231D button).

   - Flash Sale: Countdown timer "تخفيضات فلاش تنتهي خلال: [timer]" with 10-20 products grid, red prices slashed.

   - New In (وصل حديثاً): Horizontal scroll grid newest products.

   - Trending (الأكثر رواجاً): Top sellers carousel with sales badges.

   - Category Circles: 12 circular icons top (Women Abayas, Dresses, Tops; Men Thobes, Shirts; Kids Girls/Boys; Accessories modest hijabs/bags).

   - "تنسيقاتنا" (Our Styles): Gallery full modest outfits (like Shein Style Gallery), user-upload photos section.

   - Customer Reviews: Carousel real photos (modest), 5-star ratings, Jordanian comments.

   - Shop by Price/Size filters inline.

   - Footer: Links, contact Zarqa Jordan, social.

2. **Navigation: Multi-Level Mega Menu RTL (exact Shein):**

   - Women: Dresses (Short/Mini/Long/Midi modest), Tops/Blouses (sleeved), Bottoms (long skirts/pants), Outerwear (abayas/coats), Beachwear (modest swim), Plus Size modest.

   - Men: Clothing (shirts/pants/thobes), Underwear modest, Loungewear.

   - Kids: Girls/Boys/Baby modest.

   - Accessories: Hijabs, Bags, Shoes modest, Jewelry simple.

   - New In, Trending, Sale/Offers (تخفيضات).

   - Search bar: Arabic keywords auto-complete (e.g. "عباية سوداء"), image search like Shein.

   - Top bar: Login/Cart (red icon with count), Language AR/EN.

3. **Product Listing Pages (Category/Subcat):**

   - Infinite scroll grid like Shein: Image, name_ar, price red/sale slashed, colors swatches, "أضف للسلة" quick add.

   - Filters sidebar: Price, Color, Size, Material (cotton/silk), Modest Level, Rating. Sort: New/Popular/Price.

   - Pagination/scroll instant load.

4. **Product Detail Page (Shein full):**

   - Multiple images zoom/swipe (modest models 360 view if possible).

   - Title_ar, Price big red, Sale badge gold.

   - Variants: Color swatches, Size selector with chart popup (جدول القياسات: chest/waist/hip in cm).

   - Quantity +/-, "أضف للسلة" red button, "اشترِ الآن".

   - Sections: "المواصفات" (Material & Care: "قماش قطن 100%، غسيل بارد"), "الشحن" (Free over 20 JD, 2-3 days Jordan), "الإرجاع" (14 days free), "التقييمات" (stars + photos).

   - Related: Carousel similar modest items.

   - Share/Wishlist.

5. **Cart (Shein side-drawer):**

   - Slide from right: Items list with image/edit qty/delete, subtotal red.

   - "المتبقي لشحن مجاني: 10 د.أ" progress bar red.

   - Promo code input, apply.

   - "تابع للدفع" red button.

6. **Checkout (Shein 3-step simple):**

   - Step 1: Info - Guest/Login, Address (Jordan focus: Governorate like Zarqa).

   - Step 2: Shipping - Standard (free over 20 JD), Express.

   - Step 3: Payment - COD primary (with phone number), Card/PayPal.

   - Order summary, confirm. Post-order: Track page.

7. **User Account Pages (Shein full):**

   - Login/Register: Email/phone/password, social.

   - Profile: Orders history, Addresses, Wishlist, Points (loyalty like Shein).

   - Orders: Status tracker realtime (معالج/مشحون/في الطريق), COD confirm button.

   - Logout.

8. **Admin Dashboard (CRITICAL - Shein Seller Center advanced, easy add clothes):**

   - Login separate /admin.

   - Dashboard: Stats - Sales today, Orders pending (COD ticker phone confirm), Revenue graph.

   - Products: List all, Add New button.

     - Bulk Upload: CSV import (name,desc,price,images urls,sizes/colors/stock).

     - Single Add: Form - Name_ar, Description_ar detailed (AI suggest?), Images upload multiple, Variants table (size/color/stock), Category, Price/Sale.

   - Orders Tab: List all, Filter status, Bulk update, COD special: Call button/phone log.

   - Categories: CRUD.

   - Users: View customers.

   - Analytics: Top products, Low stock alert.

   - Inventory: Real-time stock edit.

   - Responsive, red theme, super simple for Jordanian admin.

**Tech Stack & Features:**

- Frontend: Next.js 15+ React, TailwindCSS for red/Arabic theme, Framer Motion animations (smooth Shein scrolls).

- Backend: Supabase (Auth, DB realtime, Storage images).

- Payments: Integrate Stripe for cards, COD manual.

- Deployment: Vercel/Supabase hosting, instant publish.

- Performance: Lazy load images, PWA, SEO Arabic meta.

- Mobile: Exact Shein app feel, bottom nav (Home/Cat/Cart/Profile).

- Security: Admin auth Row Level Security Supabase.

- Extras: Notifications realtime orders, Reviews system, Wishlist shared.

Make it LIVE tonight: Deploy to custom domain if possible, seed with 100+ modest product examples (generate fake modest images/text). Fully functional, no placeholders. Test COD flow end-to-end. Jordanian currency JD.

Role: Expert Full-Stack Dev & UI/UX Designer. Output full code/deploy.

ارفقت بعض الصور للمساعدة في التغذية الفنية . واريد اسم الويبسايت " جيران " لانه ملابس مستعمله تنتقل من جيل لجيل والخط مثل الخط المستخدم في صورة " جيران "

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://jeeran.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9b852e9d-2d33-46d7-b5e0-e15ce6ea8fc9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
