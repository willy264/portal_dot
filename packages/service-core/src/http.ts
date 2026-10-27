export class RemoteError extends Error {
  constructor(message: string, public readonly status: number, public readonly retryAfterMs = 0) {
    super(message);
  }
}

export async function jsonRequest<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, { ...init, signal: init.signal ?? AbortSignal.timeout(15_000) });
  const raw = await response.text();
  if (!response.ok) {
    const retry = response.headers.get('retry-after');
    const seconds = Number(retry);
    const retryAfterMs = retry ? (Number.isFinite(seconds) ? seconds * 1000 : Math.max(0, Date.parse(retry) - Date.now())) : 0;
    // Do not include full URLs, headers or response bodies that may contain credentials.
    throw new RemoteError(`HTTP ${response.status} from ${new URL(url).host}`, response.status, retryAfterMs);
  }
  let body: unknown;
  try { body = JSON.parse(raw); } catch { throw new RemoteError(`Non-JSON response from ${new URL(url).host}`, response.status); }
  return body as T;
}
