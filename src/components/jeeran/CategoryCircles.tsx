import abaya from "@/assets/cat-abaya.jpg";
import hijab from "@/assets/cat-hijab.jpg";
import thobe from "@/assets/cat-thobe.jpg";
import dress from "@/assets/cat-dress.jpg";
import kids from "@/assets/cat-kids.jpg";
import bags from "@/assets/cat-bags.jpg";

const cats = [
  { img: abaya, label: "عبايات" },
  { img: dress, label: "فساتين طويلة" },
  { img: hijab, label: "حجابات" },
  { img: thobe, label: "ثياب رجالي" },
  { img: bags, label: "حقائب" },
  { img: kids, label: "أطفال" },
  { img: abaya, label: "بناطيل واسعة" },
  { img: dress, label: "تنانير" },
  { img: hijab, label: "طرحات" },
  { img: thobe, label: "قمصان رجالي" },
  { img: bags, label: "إكسسوارات" },
  { img: kids, label: "بناتي" },
];

export function CategoryCircles() {
  return (
    <section className="py-10 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-5 md:gap-7 overflow-x-auto no-scrollbar scroll-x pb-2">
          {cats.map((c) => (
            <a key={c.label} href="#" className="flex flex-col items-center gap-2 shrink-0 group">
              <div className="relative w-[78px] h-[78px] md:w-[92px] md:h-[92px] rounded-full overflow-hidden ring-2 ring-gold/40 group-hover:ring-primary transition p-[3px] bg-cream">
                <img src={c.img} alt={c.label} className="w-full h-full rounded-full object-cover" loading="lazy" />
              </div>
              <span className="text-xs md:text-sm font-medium text-center">{c.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
