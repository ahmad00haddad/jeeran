import { Search, Heart, ShoppingBag, User, Menu } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "./Logo";
import { CartDrawer } from "./CartDrawer";
import { useCart, cartTotals } from "@/store/cart";

const nav = [
  { label: "نسائي", to: "/shop/$slug", slug: "women" },
  { label: "رجالي", to: "/shop/$slug", slug: "men" },
  { label: "أطفال", to: "/shop/$slug", slug: "kids" },
  { label: "حجابات", to: "/shop/$slug", slug: "hijabs" },
  { label: "عبايات", to: "/shop/$slug", slug: "abayas" },
  { label: "جديد بالعلاقة", to: "/shop", hot: true },
  { label: "تحت ١٠ د.أ", to: "/shop" },
];

export function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [q, setQ] = useState("");
  const { items, wishlist } = useCart();
  const { count } = cartTotals(items);

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button className="md:hidden p-2"><Menu className="w-6 h-6" /></button>
          <Link to="/"><Logo /></Link>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/shop?q=${encodeURIComponent(q)}`;
            }}
            className="flex-1 hidden md:flex items-center max-w-xl mx-auto relative"
          >
            <Search className="absolute right-4 w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="text"
              placeholder="دوّر على عباية، حجاب، ثوب..."
              className="w-full bg-secondary border border-border rounded-full pr-11 pl-4 py-2.5 text-sm focus:outline-none focus:border-primary transition"
            />
          </form>
          <div className="flex items-center gap-1 md:gap-3 mr-auto">
            <Link to="/account" className="p-2 hover:text-primary transition"><User className="w-5 h-5" /></Link>
            <Link to="/wishlist" className="p-2 hover:text-primary transition relative">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold text-gold-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>
              )}
            </Link>
            <button onClick={() => setCartOpen(true)} className="p-2 hover:text-primary transition relative">
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{count}</span>
              )}
            </button>
          </div>
        </div>
        <nav className="hidden md:flex max-w-7xl mx-auto px-4 gap-8 pb-3 text-sm font-medium">
          {nav.map((item) => (
            <Link
              key={item.label}
              to={item.to as any}
              params={item.slug ? { slug: item.slug } as any : undefined}
              className={`relative hover:text-primary transition ${item.hot ? "text-primary font-bold" : ""}`}
            >
              {item.label}
              {item.hot && <span className="absolute -top-2 -left-3 text-[9px] bg-primary text-primary-foreground px-1 rounded-sm">HOT</span>}
            </Link>
          ))}
        </nav>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
