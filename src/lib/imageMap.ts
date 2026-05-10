import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";

const map: Record<string, string> = {
  "p1.jpg": p1, "p2.jpg": p2, "p3.jpg": p3, "p4.jpg": p4,
  "p5.jpg": p5, "p6.jpg": p6, "p7.jpg": p7, "p8.jpg": p8,
};

export function resolveImg(url?: string | null): string {
  if (!url) return p1;
  if (url.startsWith("http")) return url;
  const name = url.split("/").pop() || "";
  return map[name] || p1;
}
