// WhatsApp number for quick contact (international format, no +)
// غيّر هذا الرقم لرقم الواتساب الرسمي لـ "جيران"
export const WHATSAPP_NUMBER = "962790000000";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
