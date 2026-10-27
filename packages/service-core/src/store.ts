import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

export const json = (value: unknown): string =>
  JSON.stringify(value, (_, v) => (typeof v === "bigint" ? v.toString() : v));

export interface ChainEvent {
  id: string;
  network: string;
  address: string;
  eventName: string;
  args: Record<string, unknown>;
  txHash: string | null;
  block: number;
  blockHash: string;
  eventIndex: number;
  observedAt: string;
  source: "evm" | "substrate";
}

export interface StoredJob {
  id: string;
  executeAfter: string;
  owner: string;
  target: string;
  data?: string;
  rentalId?: string;
  state: string;
  scheduling: string;
  scheduleTxHash?: string;
  task?: unknown;
  attempts: number;
  lastError?: string;
  nextAttemptAt?: string;
  evidence?: unknown;
}

export class Store {
  readonly db: DatabaseSync;
  constructor(path: string) {
    if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS cursors(name TEXT PRIMARY KEY, block INTEGER NOT NULL, hash TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY, block INTEGER NOT NULL, payload TEXT NOT NULL);
      CREATE INDEX IF NOT EXISTS events_block ON events(block);
      CREATE TABLE IF NOT EXISTS jobs(id TEXT PRIMARY KEY, payload TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS outbox(id TEXT PRIMARY KEY, payload TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'pending',
        attempts INTEGER NOT NULL DEFAULT 0, retry_at INTEGER NOT NULL DEFAULT 0, sent_at INTEGER, last_error TEXT);
      CREATE TABLE IF NOT EXISTS observations(id INTEGER PRIMARY KEY AUTOINCREMENT, observed_at TEXT NOT NULL, kind TEXT NOT NULL, payload TEXT NOT NULL);`);
    this.db.exec(
      "CREATE TABLE IF NOT EXISTS state(key TEXT PRIMARY KEY,payload TEXT NOT NULL)",
    );
    this.db.exec(
      "CREATE TABLE IF NOT EXISTS delivery_attempts(at INTEGER NOT NULL)",
    );
  }
  close(): void {
    this.db.close();
  }
  transaction<T>(work: () => T): T {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const result = work();
      this.db.exec("COMMIT");
      return result;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }
  setCursor(name: string, block: number, hash: string): void {
    this.db
      .prepare(
        "INSERT INTO cursors(name,block,hash) VALUES(?,?,?) ON CONFLICT(name) DO UPDATE SET block=excluded.block,hash=excluded.hash",
      )
      .run(name, block, hash);
  }
  cursor(name: string): { block: number; hash: string } | undefined {
    return this.db
      .prepare("SELECT block,hash FROM cursors WHERE name=?")
      .get(name) as { block: number; hash: string } | undefined;
  }
  /** Commit a whole finalized block and its cursor atomically. */
  saveBlock(
    name: string,
    block: number,
    hash: string,
    events: ChainEvent[],
  ): void {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const insert = this.db.prepare(
        "INSERT OR IGNORE INTO events(id,block,payload) VALUES(?,?,?)",
      );
      for (const event of events)
        insert.run(event.id, event.block, json(event));
      this.db
        .prepare(
          "INSERT INTO cursors(name,block,hash) VALUES(?,?,?) ON CONFLICT(name) DO UPDATE SET block=excluded.block,hash=excluded.hash",
        )
        .run(name, block, hash);
      this.db.exec("COMMIT");
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }
  events(fromBlock = 0, limit = 500): ChainEvent[] {
    return this.db
      .prepare(
        "SELECT payload FROM events WHERE block>=? ORDER BY block,CAST(json_extract(payload,'$.eventIndex') AS INTEGER),id LIMIT ?",
      )
      .all(fromBlock, Math.min(limit, 2000))
      .map((row) => JSON.parse(row.payload as string) as ChainEvent);
  }
  eventRange(fromBlock: number, throughBlock: number): ChainEvent[] {
    return this.db
      .prepare(
        "SELECT payload FROM events WHERE block>=? AND block<=? ORDER BY block,CAST(json_extract(payload,'$.eventIndex') AS INTEGER),id",
      )
      .all(fromBlock, throughBlock)
      .map((row) => JSON.parse(row.payload as string) as ChainEvent);
  }
  value<T>(key: string): T | undefined {
    const row = this.db
      .prepare("SELECT payload FROM state WHERE key=?")
      .get(key);
    return row ? (JSON.parse(row.payload as string) as T) : undefined;
  }
  setValue(key: string, value: unknown): void {
    this.db
      .prepare(
        "INSERT INTO state(key,payload) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET payload=excluded.payload",
      )
      .run(key, json(value));
  }
  job(id: string): StoredJob | undefined {
    const row = this.db.prepare("SELECT payload FROM jobs WHERE id=?").get(id);
    return row ? (JSON.parse(row.payload as string) as StoredJob) : undefined;
  }
  putJob(job: StoredJob): void {
    this.db
      .prepare(
        "INSERT INTO jobs(id,payload) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload",
      )
      .run(job.id, json(job));
  }
  jobs(): StoredJob[] {
    return this.db
      .prepare("SELECT payload FROM jobs")
      .all()
      .map((row) => JSON.parse(row.payload as string) as StoredJob);
  }
  enqueue(id: string, payload: unknown): boolean {
    if (this.db.prepare("SELECT id FROM outbox WHERE id=?").get(id))
      return false;
    const pending = this.db
      .prepare("SELECT COUNT(*) AS count FROM outbox WHERE state='pending'")
      .get()!;
    if (Number(pending.count) >= 1000)
      throw new Error(
        "Notification queue is full; ingestion pauses until delivery catches up",
      );
    return (
      Number(
        this.db
          .prepare("INSERT OR IGNORE INTO outbox(id,payload) VALUES(?,?)")
          .run(id, json(payload)).changes,
      ) > 0
    );
  }
  pending(
    now: number,
  ): { id: string; payload: unknown; attempts: number } | undefined {
    const row = this.db
      .prepare(
        "SELECT id,payload,attempts FROM outbox WHERE state='pending' AND retry_at<=? ORDER BY rowid LIMIT 1",
      )
      .get(now);
    return row
      ? {
          id: row.id as string,
          payload: JSON.parse(row.payload as string),
          attempts: row.attempts as number,
        }
      : undefined;
  }
  sent(id: string, now: number): void {
    this.db
      .prepare(
        "UPDATE outbox SET state='sent',sent_at=?,last_error=NULL WHERE id=?",
      )
      .run(now, id);
  }
  retry(id: string, retryAt: number, reason: string): void {
    this.db
      .prepare(
        "UPDATE outbox SET attempts=attempts+1,retry_at=?,last_error=? WHERE id=?",
      )
      .run(retryAt, reason, id);
  }
  recentDeliveries(since: number): number[] {
    return this.db
      .prepare("SELECT sent_at FROM outbox WHERE sent_at>? ORDER BY sent_at")
      .all(since)
      .map((row) => row.sent_at as number);
  }
  recordDeliveryAttempt(at: number): void {
    this.db.prepare("INSERT INTO delivery_attempts(at) VALUES(?)").run(at);
    this.db
      .prepare("DELETE FROM delivery_attempts WHERE at<?")
      .run(at - 86_400_000);
  }
  recentDeliveryAttempts(since: number): number[] {
    return this.db
      .prepare("SELECT at FROM delivery_attempts WHERE at>? ORDER BY at")
      .all(since)
      .map((row) => row.at as number);
  }
  observation(kind: string, payload: unknown): void {
    this.db
      .prepare(
        "INSERT INTO observations(observed_at,kind,payload) VALUES(?,?,?)",
      )
      .run(new Date().toISOString(), kind, json(payload));
  }
  observations(limit = 100): unknown[] {
    return this.db
      .prepare(
        "SELECT observed_at,kind,payload FROM observations ORDER BY id DESC LIMIT ?",
      )
      .all(Math.min(limit, 1000))
      .map((row) => ({
        observedAt: row.observed_at,
        kind: row.kind,
        payload: JSON.parse(row.payload as string),
      }));
  }
  queueSize(): number {
    return Number(
      this.db
        .prepare("SELECT COUNT(*) AS count FROM outbox WHERE state='pending'")
        .get()!.count,
    );
  }
}
