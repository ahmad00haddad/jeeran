import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/integrations/supabase/client";

export type CartItem = {
  id: string; // product id
  name_ar: string;
  price: number; // effective price (sale or regular)
  image_url: string;
  size?: string;
  color?: string;
  quantity: number;
};

type State = {
  items: CartItem[];
  wishlist: string[];
  add: (item: CartItem) => void;
  remove: (id: string, size?: string) => void;
  setQty: (id: string, qty: number, size?: string) => void;
  clear: () => void;
  toggleWish: (id: string) => void;
  hydrateWishlistFromDB: () => Promise<void>;
  mergeLocalWishlistToDB: () => Promise<void>;
};

const key = (i: { id: string; size?: string }) => `${i.id}::${i.size || ""}`;

export const useCart = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      add: (item) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => key(i) === key(item));
        // قطع فريدة - قطعة واحدة فقط لكل منتج
        if (idx >= 0) items[idx].quantity = 1;
        else items.push({ ...item, quantity: 1 });
        set({ items });
      },
      remove: (id, size) =>
        set({ items: get().items.filter((i) => !(i.id === id && (i.size || "") === (size || ""))) }),
      setQty: (id, qty, size) =>
        set({
          items: get().items.map((i) =>
            i.id === id && (i.size || "") === (size || "") ? { ...i, quantity: Math.max(1, qty) } : i
          ),
        }),
      clear: () => set({ items: [] }),
      toggleWish: (id) => {
        const w = get().wishlist;
        const next = w.includes(id) ? w.filter((x) => x !== id) : [...w, id];
        set({ wishlist: next });
        // Sync to DB if signed in (fire-and-forget)
        supabase.auth.getUser().then(({ data }) => {
          const uid = data.user?.id;
          if (!uid) return;
          if (next.includes(id)) {
            supabase.from("wishlists").upsert({ user_id: uid, product_id: id }, { onConflict: "user_id,product_id" }).then(() => {});
          } else {
            supabase.from("wishlists").delete().eq("user_id", uid).eq("product_id", id).then(() => {});
          }
        });
      },
      hydrateWishlistFromDB: async () => {
        const { data: u } = await supabase.auth.getUser();
        const uid = u.user?.id;
        if (!uid) return;
        const { data } = await supabase.from("wishlists").select("product_id").eq("user_id", uid);
        const ids = (data || []).map((r: { product_id: string }) => r.product_id);
        // Merge: union local + remote
        const merged = Array.from(new Set([...get().wishlist, ...ids]));
        set({ wishlist: merged });
      },
      mergeLocalWishlistToDB: async () => {
        const { data: u } = await supabase.auth.getUser();
        const uid = u.user?.id;
        if (!uid) return;
        const local = get().wishlist;
        if (local.length === 0) return;
        await supabase.from("wishlists").upsert(
          local.map((pid) => ({ user_id: uid, product_id: pid })),
          { onConflict: "user_id,product_id" }
        );
      },
    }),
    { name: "jeeran-cart" }
  )
);

export const cartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 30 || subtotal === 0 ? 0 : 3;
  return { subtotal, shipping, total: subtotal + shipping, count: items.reduce((s, i) => s + i.quantity, 0) };
};
