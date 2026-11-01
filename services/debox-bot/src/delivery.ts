import { jsonRequest, RemoteError } from "@metermend/service-core";
import type { Notification } from "./messages.js";

export type DeliveryConfig =
  | { mode: "debox"; key: string; group: string }
  | { mode: "telegram"; token: string; chat: string };

export type DeliveryReceipt =
  | {
      provider: "telegram";
      messageId: number;
      providerSentAt: string;
      acknowledgedAt: string;
    }
  | {
      provider: "debox";
      messageId: null;
      providerSentAt: null;
      acknowledgedAt: string;
    };

export async function deliver(
  config: DeliveryConfig,
  message: Notification,
): Promise<DeliveryReceipt> {
  if (config.mode === "debox") {
    const body = await jsonRequest<{
      ok?: boolean;
      success?: boolean;
      retry_after?: number;
    }>("https://open.debox.pro/openapi/bot/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": config.key },
      body: JSON.stringify({
        chat_id: config.group,
        chat_type: "group",
        content: message.content,
        parse_mode: "text",
      }),
    });
    if (body.ok !== true || body.success !== true)
      throw new RemoteError(
        "DeBox did not acknowledge successful delivery",
        200,
        Math.max(0, body.retry_after ?? 0) * 1000,
      );
    return {
      provider: "debox",
      messageId: null,
      providerSentAt: null,
      acknowledgedAt: new Date().toISOString(),
    };
  } else {
    const body = await jsonRequest<{
      ok?: boolean;
      result?: { message_id?: unknown; date?: unknown };
      parameters?: { retry_after?: number };
    }>(`https://api.telegram.org/bot${config.token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chat,
        text: message.content,
        link_preview_options: { is_disabled: true },
      }),
    });
    if (body.ok !== true)
      throw new RemoteError(
        "Telegram did not acknowledge successful delivery",
        200,
        (body.parameters?.retry_after ?? 0) * 1000,
      );
    const id = body.result?.message_id;
    const date = body.result?.date;
    if (
      typeof id !== "number" ||
      !Number.isSafeInteger(id) ||
      id <= 0 ||
      typeof date !== "number" ||
      !Number.isSafeInteger(date) ||
      date <= 0 ||
      !Number.isFinite(new Date(date * 1000).getTime())
    )
      throw new RemoteError(
        "Telegram acknowledged the request without a valid delivered-message receipt; delivery may be ambiguous",
        200,
      );
    return {
      provider: "telegram",
      messageId: id,
      providerSentAt: new Date(date * 1000).toISOString(),
      acknowledgedAt: new Date().toISOString(),
    };
  }
}
