import { afterEach, expect, it, vi } from "vitest";
import { deliver } from "../src/delivery.js";
afterEach(() => vi.unstubAllGlobals());
const notification = {
  content: "Deposit refunded",
  link: "https://example.com",
  eventId: "1",
};
it("does not treat an HTTP 200 business rejection as delivery", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async () =>
        new Response(JSON.stringify({ ok: false, success: false }), {
          status: 200,
        }),
    ),
  );
  await expect(
    deliver({ mode: "debox", key: "test", group: "group" }, notification),
  ).rejects.toThrow("did not acknowledge");
});
it("preserves Retry-After even when a throttled endpoint returns HTML", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async () =>
        new Response("<html>rate limited</html>", {
          status: 429,
          headers: { "Retry-After": "60" },
        }),
    ),
  );
  await expect(
    deliver({ mode: "debox", key: "test", group: "group" }, notification),
  ).rejects.toMatchObject({ status: 429, retryAfterMs: 60000 });
});
it("sends the documented DeBox body with the server-only App Key", async () => {
  const request = vi.fn(
    async () =>
      new Response(JSON.stringify({ ok: true, success: true }), {
        status: 200,
      }),
  );
  vi.stubGlobal("fetch", request);
  const receipt = await deliver(
    { mode: "debox", key: "local-test-key", group: "workshop" },
    notification,
  );
  expect(receipt).toMatchObject({
    provider: "debox",
    messageId: null,
    providerSentAt: null,
  });
  const args = request.mock.calls[0] as unknown as [string, RequestInit];
  expect(args[0]).toBe("https://open.debox.pro/openapi/bot/sendMessage");
  expect(JSON.parse(String(args[1].body))).toEqual({
    chat_id: "workshop",
    chat_type: "group",
    content: "Deposit refunded",
    parse_mode: "text",
  });
});

it("requires a real Telegram message receipt and returns only sanitized acknowledgement fields", async () => {
  const request = vi.fn(
    async () =>
      new Response(
        JSON.stringify({
          ok: true,
          result: {
            message_id: 42,
            date: 1793455200,
            chat: { id: "private-chat", title: "Private community" },
            from: { id: "private-bot" },
            text: "provider text",
          },
        }),
        { status: 200 },
      ),
  );
  vi.stubGlobal("fetch", request);
  const receipt = await deliver(
    { mode: "telegram", token: "local-test-token", chat: "private-chat" },
    notification,
  );
  expect(receipt).toEqual({
    provider: "telegram",
    messageId: 42,
    providerSentAt: new Date(1793455200000).toISOString(),
    acknowledgedAt: expect.any(String),
  });
  expect(Number.isFinite(Date.parse(receipt.acknowledgedAt))).toBe(true);
  expect(JSON.stringify(receipt)).not.toMatch(/private|token|provider text/);
  const args = request.mock.calls[0] as unknown as [string, RequestInit];
  expect(JSON.parse(String(args[1].body))).toMatchObject({
    chat_id: "private-chat",
    text: notification.content,
  });
});

it("does not claim delivery for incomplete, invalid or deferred Telegram message acknowledgements", async () => {
  for (const result of [
    undefined,
    {},
    { message_id: 0, date: 1793455200 },
    { message_id: "42", date: 1793455200 },
    { message_id: 42, date: 0 },
    { message_id: 42, date: Number.MAX_SAFE_INTEGER },
  ]) {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ ok: true, result }), { status: 200 }),
      ),
    );
    await expect(
      deliver(
        { mode: "telegram", token: "local-test-token", chat: "private-chat" },
        notification,
      ),
    ).rejects.toThrow("without a valid delivered-message receipt");
  }
});

it("preserves Telegram retry guidance without leaking provider response content", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            ok: false,
            description: "private-chat local-test-token",
            parameters: { retry_after: 7 },
          }),
          { status: 200 },
        ),
    ),
  );
  const error = await deliver(
    { mode: "telegram", token: "local-test-token", chat: "private-chat" },
    notification,
  ).catch((failure: unknown) => failure);
  expect(error).toMatchObject({
    message: "Telegram did not acknowledge successful delivery",
    retryAfterMs: 7000,
  });
  expect(String(error)).not.toMatch(/private-chat|local-test-token/);
});
