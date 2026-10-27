import { readLedger } from "@/lib/ledger-server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() { return Response.json(await readLedger(), {headers:{"Cache-Control":"no-store"}}); }
