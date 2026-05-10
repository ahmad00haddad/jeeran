import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react";

const items = [
  { icon: Home, label: "الرئيسية", active: true },
  { icon: LayoutGrid, label: "الأقسام" },
  { icon: ShoppingBag, label: "السلة", badge: 3 },
  { icon: Heart, label: "المفضلة" },
  { icon: User, label: "حسابي" },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-cream border-t border-border grid grid-cols-5">
      {items.map((it) => (
        <button key={it.label} className={`flex flex-col items-center gap-0.5 py-2 text-[10px] relative ${it.active ? "text-primary" : "text-muted-foreground"}`}>
          <it.icon className="w-5 h-5" />
          {it.badge && <span className="absolute top-1.5 right-1/4 bg-primary text-primary-foreground text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{it.badge}</span>}
          <span className="font-medium">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}
