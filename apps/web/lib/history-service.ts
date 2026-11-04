import { errorMessage } from "./format";

export const HISTORY_WAKING_MESSAGE =
  "Render Free history may be waking up. Events and job history are temporarily unavailable; retry shortly. Current balances and rental status are read separately from Portaldot.";

/** Cold history storage must never be confused with unavailable live chain state. */
export async function readHistoryJson(
  base: string,
  route: string,
  timeoutMs = 8000,
): Promise<any> {
  const isRender = new URL(base).hostname.endsWith(".onrender.com");
  let response: Response;
  try {
    response = await fetch(new URL(route, base), {
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    if (
      isRender &&
      error instanceof Error &&
      ["TimeoutError", "AbortError", "TypeError"].includes(error.name)
    )
      throw new Error(HISTORY_WAKING_MESSAGE, { cause: error });
    throw new Error(errorMessage(error), { cause: error });
  }
  if (!response.ok) {
    if (isRender && [502, 503, 504].includes(response.status))
      throw new Error(HISTORY_WAKING_MESSAGE);
    throw new Error(`History service returned ${response.status}.`);
  }
  return response.json();
}
