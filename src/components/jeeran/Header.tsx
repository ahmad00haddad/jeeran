import { Search, Heart, ShoppingBag, User, Menu } from "lucide-react";
import { Logo } from "./Logo";

const nav = [
  "نسائي",
  "رجالي",
  "أطفال",
  "حجابات",
  "إكسسوارات",
  { label: "تخفيضات", hot: true },
  "وصل حديثاً",
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <button className="md:hidden p-2"><Menu className="w-6 h-6" /></button>
        <Logo />
        <div className="flex-1 hidden md:flex items-center max-w-xl mx-auto relative">
          <Search className="absolute right-4 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="دوّر على عباية، حجاب، ثوب..."
            className="w-full bg-secondary border border-border rounded-full pr-11 pl-4 py-2.5 text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
        <div className="flex items-center gap-1 md:gap-3 mr-auto">
          <button className="p-2 hover:text-primary transition"><User className="w-5 h-5" /></button>
          <button className="p-2 hover:text-primary transition relative">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 hover:text-primary transition relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">3</span>
          </button>
        </div>
      </div>
      <nav className="hidden md:flex max-w-7xl mx-auto px-4 gap-8 pb-3 text-sm font-medium">
        {nav.map((item) => {
          const label = typeof item === "string" ? item : item.label;
          const hot = typeof item !== "string" && item.hot;
          return (
            <a
              key={label}
              href="#"
              className={`relative hover:text-primary transition ${hot ? "text-primary font-bold" : ""}`}
            >
              {label}
              {hot && <span className="absolute -top-2 -left-3 text-[9px] bg-primary text-primary-foreground px-1 rounded-sm">HOT</span>}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
