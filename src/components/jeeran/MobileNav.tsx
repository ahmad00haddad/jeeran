import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useCart, cartTotals } from "@/store/cart";

export function MobileNav() {
  const loc = useLocation();
  const { items, wishlist } = useCart();
  const { count } = cartTotals(items);

  const items_nav = [
    { icon: Home, label: "الرئيسية", to: "/" },
    { icon: LayoutGrid, label: "الأقسام", to: "/shop" },
    { icon: ShoppingBag, label: "السلة", to: "/cart", badge: count },
    { icon: Heart, label: "المفضلة", to: "/wishlist", badge: wishlist.length },
    { icon: User, label: "حسابي", to: "/account" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-cream border-t border-border grid grid-cols-5">
      {items_nav.map((it) => {
        const active = loc.pathname === it.to;
        return (
          <Link key={it.label} to={it.to} className={`flex flex-col items-center gap-0.5 py-2 text-[10px] relative ${active ? "text-primary" : "text-muted-foreground"}`}>
            <it.icon className="w-5 h-5" />
            {it.badge ? <span className="absolute top-1.5 right-1/4 bg-primary text-primary-foreground text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{it.badge}</span> : null}
            <span className="font-medium">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
