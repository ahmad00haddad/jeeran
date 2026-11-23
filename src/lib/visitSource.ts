import { supabase } from "@/integrations/supabase/client";

const KEY = "jeeran_visit_source";

function classify(ref: string, utm: string | null): string {
  if (utm) return utm.toLowerCase().slice(0, 100);
  if (!ref) return "direct";
  let host = "";
  try { host = new URL(ref).hostname.toLowerCase(); } catch { return "other"; }
  if (host === location.hostname) return "internal";
  const map: [RegExp, string][] = [
    [/facebook|fb\./, "facebook"], [/instagram/, "instagram"], [/whatsapp|wa\.me/, "whatsapp"],
    [/t\.me|telegram/, "telegram"], [/tiktok/, "tiktok"], [/google\./, "google"], [/bing\./, "bing"],
    [/(^|\.)x\.com|twitter|t\.co$/, "x"], [/snapchat/, "snapchat"], [/lovable/, "lovable"],
  ];
  for (const [re, name] of map) if (re.test(host)) return name;
  return host.slice(0, 100);
}

function device() {
  return /Mobi|Android|iPhone/i.test(navigator.userAgent) ? "mobile" : "desktop";
}

/** يسجّل مصدر الزيارة مرة واحدة لكل جلسة */
export function trackVisitSource() {
  if (typeof window === "undefined" || location.pathname.startsWith("/admin")) return;
  if (sessionStorage.getItem(KEY)) return;
  const p = new URLSearchParams(location.search);
  const source = classify(document.referrer, p.get("utm_source"));
  if (source === "internal") return;
  sessionStorage.setItem(KEY, source);
  void supabase.from("visit_sources").insert({
    kind: "visit", source,
    referrer: document.referrer.slice(0, 500) || null,
    utm_source: p.get("utm_source")?.slice(0, 100) ?? null,
    utm_medium: p.get("utm_medium")?.slice(0, 100) ?? null,
    utm_campaign: p.get("utm_campaign")?.slice(0, 100) ?? null,
    landing_path: location.pathname.slice(0, 300),
    device: device(),
  });
}

/** يسجّل ضغطة على أي رابط واتساب مع مصدر الزائر */
export function installWhatsappClickTracking() {
  if (typeof window === "undefined") return;
  document.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement | null)?.closest?.("a[href*='wa.me'], a[href*='whatsapp']");
    if (!a || location.pathname.startsWith("/admin")) return;
    void supabase.from("visit_sources").insert({
      kind: "whatsapp",
      source: sessionStorage.getItem(KEY) || "direct",
      landing_path: location.pathname.slice(0, 300),
      device: device(),
    });
  }, { capture: true });
}
