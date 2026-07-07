import { Search, Heart, ShoppingBag, User, Menu } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "./Logo";
import { CartDrawer } from "./CartDrawer";
import { useCart, cartTotals } from "@/store/cart";


export function Header() {
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [q, setQ] = useState("");
  const { items, wishlist } = useCart();
  const { count } = cartTotals(items);

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            aria-label="فتح القائمة"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden p-2 min-h-11 min-w-11"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" aria-label="جيران — الرئيسية"><Logo /></Link>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/shop", search: { q, sort: "new" } });
            }}
            role="search"
            className="flex-1 hidden md:flex items-center max-w-xl mx-auto relative"
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
          <div className="flex items-center gap-1 md:gap-3 mr-auto">
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
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-cream">
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1 text-sm">
              <form
                onSubmit={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate({ to: "/shop", search: { q, sort: "new" } }); }}
                role="search"
                className="relative mb-2"
              >
                <label htmlFor="mobile-search" className="sr-only">بحث</label>
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <input
                  id="mobile-search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  type="search"
                  placeholder="دوّري..."
                  className="w-full bg-secondary border border-border rounded-full pr-10 pl-4 py-2.5 text-sm"
                />
              </form>
              <Link onClick={() => setMobileMenuOpen(false)} to="/" className="py-2 px-2 hover:text-primary">الرئيسية</Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/shop" className="py-2 px-2 hover:text-primary">تسوّقي</Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/wishlist" className="py-2 px-2 hover:text-primary">المفضلة</Link>
              <Link onClick={() => setMobileMenuOpen(false)} to="/account" className="py-2 px-2 hover:text-primary">حسابي</Link>
            </nav>
          </div>
        )}
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}


