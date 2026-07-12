import { Search, Heart, ShoppingBag, User, ArrowRight, X } from "lucide-react";
import { Link, useNavigate, useRouter, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "./Logo";
import { CartDrawer } from "./CartDrawer";
import { useCart, cartTotals } from "@/store/cart";

export function Header() {
  const navigate = useNavigate();
  const router = useRouter();
  const loc = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const { items, wishlist } = useCart();
  const { count } = cartTotals(items);

  const isHome = loc.pathname === "/";

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-border safe-top">
        {/* Mobile header — app-like */}
        <div className="md:hidden max-w-7xl mx-auto px-3 h-14 flex items-center gap-2">
          {!isHome ? (
            <button
              aria-label="رجوع"
              onClick={() => router.history.back()}
              className="p-2 -ms-2 tap"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          ) : (
            <div className="w-10" />
          )}
          <Link to="/" aria-label="جيران — الرئيسية" className="flex-1 flex justify-center tap">
            <Logo />
          </Link>
          <button
            aria-label="بحث"
            onClick={() => setSearchOpen(true)}
            className="p-2 tap"
          >
            <Search className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop header */}
        <div className="hidden md:flex max-w-7xl mx-auto px-4 py-3 items-center gap-4">
          <Link to="/" aria-label="جيران — الرئيسية"><Logo /></Link>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/shop", search: { q, sort: "new" } });
            }}
            role="search"
            className="flex-1 flex items-center max-w-xl mx-auto relative"
          >
            <label htmlFor="site-search" className="sr-only">بحث</label>
            <Search className="absolute right-4 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <input
              id="site-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="search"
              placeholder="دوّر على قطعة، براند، أو نوع..."
              className="w-full bg-secondary border border-border rounded-full pr-11 pl-4 py-2.5 text-sm focus:outline-none focus:border-primary transition"
            />
          </form>
          <div className="flex items-center gap-3 mr-auto">
            <Link to="/account" aria-label="حسابي" className="p-2 hover:text-primary transition"><User className="w-5 h-5" /></Link>
            <Link to="/wishlist" aria-label="المفضلة" className="p-2 hover:text-primary transition relative">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold text-gold-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>
              )}
            </Link>
            <button aria-label="السلة" onClick={() => setCartOpen(true)} className="p-2 hover:text-primary transition relative">
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{count}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen search overlay for mobile */}
      {searchOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-cream safe-top flex flex-col animate-in fade-in duration-150">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearchOpen(false);
              navigate({ to: "/shop", search: { q, sort: "new" } });
            }}
            role="search"
            className="flex items-center gap-2 p-3 border-b border-border"
          >
            <button type="button" aria-label="إغلاق" onClick={() => setSearchOpen(false)} className="p-2 tap">
              <X className="w-6 h-6" />
            </button>
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="search"
                placeholder="دوّري على قطعة، براند، لون..."
                className="w-full bg-secondary border border-border rounded-full pr-10 pl-4 py-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </form>
          <div className="p-4 text-sm text-muted-foreground">
            <div className="mb-2 font-bold text-foreground">اقتراحات شائعة</div>
            <div className="flex flex-wrap gap-2">
              {["عبايات", "جلابيات", "طرحات", "فساتين سهرة", "أطفال"].map((s) => (
                <button
                  key={s}
                  onClick={() => { setSearchOpen(false); navigate({ to: "/shop", search: { q: s, sort: "new" } }); }}
                  className="px-3 py-1.5 rounded-full bg-secondary border border-border tap"
                >{s}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
