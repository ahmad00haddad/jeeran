// Custom font loader for admin font testing.
// Stores a user-uploaded font as a data URL in localStorage and injects
// an @font-face that overrides --font-display and --font-sans globally.

const STORAGE_KEY = "jeeran-custom-font";
const STYLE_ID = "jeeran-custom-font-style";
const FAMILY = "JeeranCustom";

export type CustomFont = {
  name: string;
  format: string; // woff2 | woff | truetype | opentype
  dataUrl: string;
};

export const ACCEPTED_FONT_EXT = ".woff2,.woff,.ttf,.otf";

function formatFromExt(name: string): string | null {
  const ext = name.toLowerCase().split(".").pop();
  switch (ext) {
    case "woff2": return "woff2";
    case "woff": return "woff";
    case "ttf": return "truetype";
    case "otf": return "opentype";
    default: return null;
  }
}

export function injectCustomFont(font: CustomFont) {
  if (typeof document === "undefined") return;
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = `
    @font-face {
      font-family: '${FAMILY}';
      src: url(${font.dataUrl}) format('${font.format}');
      font-display: swap;
      font-weight: 100 900;
    }
    :root {
      --font-display: '${FAMILY}', 'Reem Kufi', 'Tajawal', sans-serif !important;
      --font-sans: '${FAMILY}', 'Tajawal', system-ui, sans-serif !important;
      --font-serif: '${FAMILY}', 'Amiri', serif !important;
    }
    body, h1, h2, h3, h4, h5, h6, .font-display, .font-serif-ar {
      font-family: '${FAMILY}', var(--font-sans) !important;
    }
  `;
}

export function loadSavedFont() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const font = JSON.parse(raw) as CustomFont;
    injectCustomFont(font);
    return font;
  } catch {
    return null;
  }
}

export async function saveCustomFont(file: File): Promise<CustomFont> {
  const format = formatFromExt(file.name);
  if (!format) throw new Error("صيغة غير مدعومة. الصيغ المقبولة: .woff2, .woff, .ttf, .otf");
  if (file.size > 4 * 1024 * 1024) throw new Error("حجم الخط أكبر من 4MB");
  const dataUrl: string = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
  const font: CustomFont = { name: file.name, format, dataUrl };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(font));
  injectCustomFont(font);
  return font;
}

export function clearCustomFont() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  const style = document.getElementById(STYLE_ID);
  if (style) style.remove();
}
