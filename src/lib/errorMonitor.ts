// Lightweight client-side error monitoring: records uncaught errors and
// promise rejections into the `client_errors` table so the admin can see
// what broke for real visitors.
import { supabase } from "@/integrations/supabase/client";

let installed = false;
const seen = new Set<string>();
let sentInSession = 0;

async function report(message: string, stack?: string) {
  if (!message) return;
  if (sentInSession >= 10) return; // avoid flooding
  const key = `${message}|${(stack || "").slice(0, 120)}`;
  if (seen.has(key)) return;
  seen.add(key);
  sentInSession++;
  try {
    const { data } = await supabase.auth.getUser();
    await supabase.from("client_errors").insert({
      message: message.slice(0, 500),
      stack: (stack || "").slice(0, 3000),
      path: window.location.pathname + window.location.search,
      user_agent: navigator.userAgent.slice(0, 300),
      user_id: data.user?.id ?? null,
    });
  } catch { /* monitoring must never break the app */ }
}

export function reportError(err: unknown, context?: string) {
  const e = err as Error;
  report(`${context ? context + ": " : ""}${e?.message ?? String(err)}`, e?.stack);
}

export function installErrorMonitoring() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  window.addEventListener("error", (e) => report(e.message, e.error?.stack));
  window.addEventListener("unhandledrejection", (e) => {
    const r = e.reason as Error;
    report(r?.message ?? String(r), r?.stack);
  });
}
