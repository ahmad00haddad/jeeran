import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  kind: z.enum(["order", "rental"]),
  title: z.string().max(120),
  lines: z.array(z.string().max(200)).max(12),
});

/**
 * Sends an admin alert to Telegram when TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID are set.
 * Silently no-ops otherwise so the customer flow is never blocked.
 */
export const notifyAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const token = process.env["TELEGRAM_BOT_TOKEN"];
    const chatId = process.env["TELEGRAM_CHAT_ID"];
    if (!token || !chatId) return { sent: false };

    const icon = data.kind === "order" ? "🛍️" : "✨";
    const text = [`${icon} ${data.title}`, ...data.lines].join("\n");

    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      });
      return { sent: res.ok };
    } catch {
      return { sent: false };
    }
  });
