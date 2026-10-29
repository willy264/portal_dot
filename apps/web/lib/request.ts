export async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { cache: "no-store", ...init });
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error =
      data && typeof data === "object" && "error" in data
        ? String(data.error)
        : `Request failed (${response.status}).`;
    throw new Error(error);
  }
  if (data === null)
    throw new Error("The server returned an unreadable response.");
  return data as T;
}
