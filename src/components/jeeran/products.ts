import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";

export type Product = {
  id: string;
  name: string;
  price: number;
  sale?: number;
  img: string;
  badge?: string;
  rating?: number;
  reviews?: number;
};

export const products: Product[] = [
  { id: "1", name: "عباية مطرّزة بخيط ذهبي - أناقة شامية", price: 65, sale: 39.9, img: p1, badge: "الأكثر مبيعاً", rating: 4.9, reviews: 1284 },
  { id: "2", name: "فستان طويل بعنابي ساتان مع ياقة كلاسيكية", price: 48, sale: 29.5, img: p2, badge: "تخفيض", rating: 4.8, reviews: 932 },
  { id: "3", name: "ثوب رجالي قطن ١٠٠٪ بياقة ذهبية", price: 42, img: p3, rating: 4.7, reviews: 421 },
  { id: "4", name: "حجاب حرير كريمي بحواف ذهبية", price: 18, sale: 12.9, img: p4, badge: "وصل حديثاً", rating: 5.0, reviews: 318 },
  { id: "5", name: "قفطان أخضر مطرّز بنقشة شرقية", price: 75, sale: 49, img: p5, badge: "حصري", rating: 4.9, reviews: 612 },
  { id: "6", name: "حجاب أسود بلؤلؤ - فخامة هادئة", price: 22, img: p6, rating: 4.8, reviews: 245 },
  { id: "7", name: "ثوب أطفال كريمي - مقاسات ٤-١٢ سنة", price: 25, sale: 17.9, img: p7, badge: "تخفيض", rating: 4.9, reviews: 156 },
  { id: "8", name: "حقيبة جلدية عنابي بمقابض ذهبية", price: 55, sale: 32.9, img: p8, rating: 4.7, reviews: 389 },
];
