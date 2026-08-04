// Client-side image compression before upload — keeps the storefront fast.
import { supabase } from "@/integrations/supabase/client";

const MAX_DIM = 1400;
const QUALITY = 0.82;

export async function compressImage(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) throw new Error("الملف مش صورة");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("المتصفح ما بيدعم ضغط الصور");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  const blob: Blob | null = await new Promise((res) =>
    canvas.toBlob((b) => res(b), "image/webp", QUALITY),
  );
  if (!blob) throw new Error("فشل ضغط الصورة");
  return blob;
}

export async function uploadProductImage(file: File): Promise<string> {
  if (file.size > 15 * 1024 * 1024) throw new Error("حجم الصورة أكبر من 15MB");
  const blob = await compressImage(file);
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, blob, { contentType: "image/webp", cacheControl: "31536000", upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}
