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
    <nav
      dir="rtl"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border grid grid-cols-5 pb-safe"
      style={{ boxShadow: "0 -8px 24px -12px rgba(0,0,0,0.12)" }}
    >
      {items_nav.map((it) => {
        const active = loc.pathname === it.to;
        return (
          <Link
            key={it.label}
            to={it.to}
            onClick={() => { try { (navigator as any).vibrate?.(8); } catch {} }}
            data-tour={it.to === "/cart" ? "cart" : it.to === "/wishlist" ? "wishlist" : undefined}
            className="relative flex flex-col items-center justify-center gap-1 pt-2 pb-1 tap"
            aria-current={active ? "page" : undefined}
          >
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-primary rounded-full" />
            )}
            <div className="relative">
              <it.icon
                className={`w-6 h-6 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                strokeWidth={active ? 2.4 : 1.8}
              />
              {it.badge ? (
                <span className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[10px] min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center font-bold">
                  {it.badge > 9 ? "9+" : it.badge}
                </span>
              ) : null}
            </div>
            <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
              {it.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
