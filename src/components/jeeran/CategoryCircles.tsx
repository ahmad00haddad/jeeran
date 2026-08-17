import { Link } from "@tanstack/react-router";
import abaya from "@/assets/cat-abaya.jpg";
import hijab from "@/assets/cat-hijab.jpg";
import thobe from "@/assets/cat-thobe.jpg";
import dress from "@/assets/cat-dress.jpg";
import kids from "@/assets/cat-kids.jpg";
import bags from "@/assets/cat-bags.jpg";

const cats = [
  { img: abaya, label: "عبايات", slug: "abayas" },
  { img: dress, label: "فساتين طويلة", slug: "dresses" },
  { img: hijab, label: "حجابات", slug: "hijabs" },
  { img: thobe, label: "ثياب رجالي", slug: "thobes" },
  { img: bags, label: "حقائب", slug: "accessories" },
  { img: kids, label: "أطفال", slug: "kids" },
  { img: abaya, label: "نسائي", slug: "women" },
  { img: dress, label: "رجالي", slug: "men" },
];

export function CategoryCircles() {
  return (
    <section className="py-10 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-5 md:gap-7 overflow-x-auto no-scrollbar scroll-x pb-2">
          {cats.map((c) => (
            <Link key={c.label} to="/shop/$slug" params={{ slug: c.slug }} className="flex flex-col items-center gap-2 shrink-0 group">
              <div className="relative w-[78px] h-[78px] md:w-[92px] md:h-[92px] rounded-full overflow-hidden ring-2 ring-gold/40 group-hover:ring-primary transition p-[3px] bg-background">
                <img src={c.img} alt={c.label} className="w-full h-full rounded-full object-cover" loading="lazy" />
              </div>
              <span className="text-xs md:text-sm font-medium text-center">{c.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

