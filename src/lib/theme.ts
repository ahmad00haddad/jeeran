// Night mode (dark wine) theme handling — persisted in localStorage.
export type Theme = "light" | "dark";

const KEY = "jeeran-theme";

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}

export function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  try { localStorage.setItem(KEY, theme); } catch { /* ignore */ }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#1b0d0d" : "#F5F5DC");
}

/** Inline script injected in <head> to avoid a flash of the wrong theme. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('jeeran-theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;
