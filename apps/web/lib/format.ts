import { formatUnits, parseUnits } from "viem";
export const rentalStatuses = ["Unknown", "In use", "Return window", "Disputed", "Closed"] as const;
export function shortAddress(value: string, size = 6) { return value.length > size * 2 + 3 ? `${value.slice(0, size)}…${value.slice(-size)}` : value; }
export function exactAmount(value: string | bigint, decimals = 18) { return formatUnits(BigInt(value), decimals); }
export function amount(value: string | bigint, decimals = 18) { const [whole, fraction] = exactAmount(value, decimals).split("."); const grouped = whole!.replace(/\B(?=(\d{3})+(?!\d))/g, ","); const shown = fraction?.slice(0, 4).replace(/0+$/, ""); if (BigInt(value) !== 0n && whole === "0" && !shown) return "<0.0001"; return `${grouped}${shown ? `.${shown}` : ""}`; }
export function parseAmount(value: string, decimals = 18) { const clean=value.trim(); if (!/^\d+(\.\d+)?$/.test(clean)) throw new Error("Enter a nonnegative tPOT amount."); if ((clean.split(".")[1]?.length ?? 0) > decimals) throw new Error(`Use at most ${decimals} decimal places.`); return parseUnits(clean, decimals); }
export function asId(value: string) { if (!/^[1-9]\d*$/.test(value)) throw new Error("Choose a valid item or rental ID."); return BigInt(value); }
export function sameAddress(a?: string | null, b?: string | null) { return !!a && !!b && a.toLowerCase() === b.toLowerCase(); }
export function dateTime(seconds: number) { return new Date(seconds * 1000).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }); }
export function duration(seconds: number) { if (seconds >= 86400) return `${Math.round(seconds / 86400)} day${seconds >= 172800 ? "s" : ""}`; if (seconds >= 3600) return `${Math.round(seconds / 3600)} hours`; return `${Math.round(seconds / 60)} min`; }
export function errorMessage(error: unknown) { return error instanceof Error ? error.message : "The request could not be completed."; }
export function safeImage(value: unknown): string | undefined { if (typeof value !== "string") return; if (/^\/api\/evidence\/[0-9a-f]{64}$/.test(value)) return value; try { const u = new URL(value); if (u.protocol === "https:") return u.href; } catch {} }
export function metadata(uri: string, id: string) {
  let value: Record<string, unknown> = {};
  try { if (uri.startsWith("data:application/json,")) value = JSON.parse(decodeURIComponent(uri.slice(22))); else if (uri.startsWith("{")) value = JSON.parse(uri); } catch {}
  const name = typeof value.name === "string" ? value.name.slice(0, 100) : `Workshop item ${id}`;
  const category = /camera|canon|lens/i.test(name) ? "camera" as const : /printer|3d/i.test(name) ? "printer" as const : "tool" as const;
  return { name, description: typeof value.description === "string" ? value.description.slice(0, 500) : "Shared equipment with its own repair reserve.", category, image: safeImage(value.image) };
}
