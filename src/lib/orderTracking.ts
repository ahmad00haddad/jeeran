// Keeps a local record of the customer's own orders so she can always find
// them again (guest checkout has no account).

const KEY = "jeeran-my-orders";

export type LocalOrder = { order_number: string; phone: string; total: number; at: number };

export function saveLocalOrder(o: LocalOrder) {
  if (typeof window === "undefined") return;
  try {
    const list = getLocalOrders().filter((x) => x.order_number !== o.order_number);
    list.unshift(o);
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 20)));
  } catch { /* ignore */ }
}

export function getLocalOrders(): LocalOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LocalOrder[]) : [];
  } catch {
    return [];
  }
}

export const ORDER_STATUS_AR: Record<string, { label: string; hint: string; step: number }> = {
  pending: { label: "بانتظار التأكيد", hint: "استلمنا طلبك وعم نتأكد من توفر القطع.", step: 1 },
  confirmed: { label: "تم التأكيد", hint: "القطع محجوزة إلك وعم نجهّز الطرد.", step: 2 },
  shipped: { label: "بالطريق إلك", hint: "الطرد مع المندوب، رح يحكيك قبل ما يوصل.", step: 3 },
  delivered: { label: "تم التسليم", hint: "وصلك الطلب — نتمنى يكون عجبك ✨", step: 4 },
  cancelled: { label: "ملغي", hint: "انلغى الطلب. إذا في استفسار راسلينا واتساب.", step: 0 },
  rejected: { label: "مرفوض", hint: "ما قدرنا ننفّذ هالطلب. راسلينا واتساب للتفاصيل.", step: 0 },
};
