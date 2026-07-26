// Normalize Arabic-Indic digits, strip spaces/punctuation, unify +962/00962 prefixes.
const AR_DIGITS: Record<string, string> = {
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
  "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
  "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
};

export function normalizePhone(input: string): string {
  if (!input) return "";
  let s = input.replace(/[٠-٩۰-۹]/g, (d) => AR_DIGITS[d] ?? d);
  s = s.replace(/[\s\-()]/g, "");
  if (s.startsWith("+962")) s = "0" + s.slice(4);
  else if (s.startsWith("00962")) s = "0" + s.slice(5);
  else if (s.startsWith("962") && s.length >= 12) s = "0" + s.slice(3);
  return s;
}

export const JO_PHONE_RE = /^07[7-9]\d{7}$/;
export const isValidJoPhone = (p: string) => JO_PHONE_RE.test(normalizePhone(p));

export function normalizeName(input: string): string {
  return (input || "").replace(/\s+/g, " ").trim();
}
