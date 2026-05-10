import { create } from "zustand";
import { persist } from "zustand/middleware";

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
        if (idx >= 0) items[idx].quantity += item.quantity;
        else items.push(item);
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
        set({ wishlist: w.includes(id) ? w.filter((x) => x !== id) : [...w, id] });
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
