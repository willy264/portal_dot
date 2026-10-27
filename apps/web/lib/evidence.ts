export const MAX_EVIDENCE_BYTES = 5 * 1024 * 1024;
export function normalizeHash(value: string): string { const hash=value.replace(/^0x/,"").toLowerCase();if(!/^[0-9a-f]{64}$/.test(hash))throw new Error("A SHA-256 evidence hash is required.");return hash; }
export function imageMime(bytes: Uint8Array): string | null {
  if(bytes.length>=8 && [137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v))return "image/png";
  if(bytes.length>=4 && bytes[0]===255 && bytes[1]===216 && bytes[2]===255)return "image/jpeg";
  if(bytes.length>=12 && String.fromCharCode(...bytes.slice(0,4))==="RIFF" && String.fromCharCode(...bytes.slice(8,12))==="WEBP")return "image/webp";
  return null;
}
export async function hashBytes(bytes: ArrayBuffer): Promise<`0x${string}`> {
  const digest=await crypto.subtle.digest("SHA-256",bytes);return `0x${Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,"0")).join("")}`;
}
