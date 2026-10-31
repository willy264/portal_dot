import { afterEach, expect, it } from "vitest";
import { DatabaseSync } from "node:sqlite";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { Hono } from "hono";
import { Store, type ChainEvent } from "@metermend/service-core";
import { eventRoutes } from "../src/events.js";

const stores: Store[] = [];
const directories: string[] = [];
afterEach(() => {
  for (const store of stores.splice(0)) store.close();
  for (const directory of directories.splice(0)) {
    if (
      !resolve(directory).startsWith(
        resolve(tmpdir()) + sep + "metermend-events-",
      )
    )
      throw new Error("Unexpected cleanup path");
    rmSync(directory, { recursive: true, force: true });
  }
});
function temporaryDatabase() {
  const directory = mkdtempSync(join(tmpdir(), "metermend-events-"));
  directories.push(directory);
  return join(directory, "events.sqlite");
}
function open(path = ":memory:") {
  const store = new Store(path);
  stores.push(store);
  return store;
}
const hash = (block: number) => `0x${block.toString(16).padStart(64, "0")}`;
function event(block: number): ChainEvent {
  return {
    id: `event-${block}`,
    network: "v3",
    address: "0x1",
    eventName: "Rented",
    args: { fee: "100" },
    txHash: hash(1),
    block,
    blockHash: hash(block),
    eventIndex: 0,
    observedAt: "2026-10-31T00:00:00Z",
    source: "substrate",
  };
}
function app(store: Store, gap: string | null = null, startBlock = 100) {
  return new Hono().route(
    "/events",
    eventRoutes(store, startBlock, () => ({ gap, automaticRefundCount: 2 })),
  );
}
function legacyDatabase(events: ChainEvent[] = []) {
  const path = temporaryDatabase();
  const db = new DatabaseSync(path);
  db.exec(`
    CREATE TABLE cursors(name TEXT PRIMARY KEY, block INTEGER NOT NULL, hash TEXT NOT NULL);
    CREATE TABLE events(id TEXT PRIMARY KEY, block INTEGER NOT NULL, payload TEXT NOT NULL);
  `);
  db.prepare("INSERT INTO cursors(name,block,hash) VALUES(?,?,?)").run(
    "chain",
    220,
    hash(220),
  );
  for (const record of events)
    db.prepare("INSERT INTO events(id,block,payload) VALUES(?,?,?)").run(
      record.id,
      record.block,
      JSON.stringify(record),
    );
  db.close();
  return open(path);
}

it("pages persisted events after restart without a node, including empty page boundaries", async () => {
  const path = temporaryDatabase();
  let store = open(path);
  for (let block = 100; block <= 220; block++)
    store.saveBlock(
      "chain",
      block,
      hash(block),
      block % 30 === 0 ? [event(block)] : [],
    );
  stores.pop();
  store.close();
  store = open(path);
  const api = app(store, "Node is offline; ingestion paused");
  const collected: ChainEvent[] = [];
  for (const [from, through] of [
    [0, 149],
    [150, 199],
    [200, 220],
  ]) {
    const response = await api.request(`/events?fromBlock=${from}`);
    expect(response.status).toBe(200);
    const page = await response.json();
    expect(page).toMatchObject({
      throughBlock: through,
      throughHash: hash(through!),
      gap: "Node is offline; ingestion paused",
      automaticRefundCount: 2,
    });
    collected.push(...page.events);
  }
  expect(collected.map((record) => record.block)).toEqual([120, 150, 180, 210]);
  const all = await (await api.request("/events")).json();
  expect(all.events).toEqual(collected);
  expect(all.throughHash).toBe(hash(220));
  const exhausted = await (await api.request("/events?fromBlock=221")).json();
  expect(exhausted).toMatchObject({
    events: [],
    throughBlock: 220,
    throughHash: hash(220),
  });
});

it("uses retained event and cursor hashes when upgrading a legacy database", async () => {
  const store = legacyDatabase([event(149)]);
  const api = app(store);
  const response = await api.request("/events?fromBlock=100");
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({
    events: [event(149)],
    throughBlock: 149,
    throughHash: hash(149),
  });
  expect(
    await (await api.request("/events?fromBlock=200")).json(),
  ).toMatchObject({
    throughBlock: 220,
    throughHash: hash(220),
  });
  store.saveBlock("chain", 221, hash(221), []);
  expect(store.blockHash(221)).toBe(hash(221));
  expect(store.blockHash(220)).toBe(hash(220));
});

it("reports a legacy empty boundary gap without supplying a cursor that could skip it", async () => {
  const store = legacyDatabase([event(120)]);
  const api = app(store, "Node history is pruned");
  const response = await api.request("/events?fromBlock=100");
  expect(response.status).toBe(503);
  const page = await response.json();
  expect(page.gap).toContain("Finalized block 149 has no retained hash");
  expect(page.gap).toContain("Node history is pruned");
  expect(page.throughBlock).toBeUndefined();
  expect(page.throughHash).toBeUndefined();
  expect(store.cursor("chain")).toEqual({ block: 220, hash: hash(220) });
  const all = await api.request("/events");
  expect(all.status).toBe(200);
  expect((await all.json()).events).toEqual([event(120)]);
});

it("rejects conflicting retained hashes rather than choosing one as proof", async () => {
  const conflict = { ...event(149), id: "conflict", blockHash: hash(999) };
  const store = legacyDatabase([event(149), conflict]);
  const response = await app(store).request("/events?fromBlock=100");
  expect(response.status).toBe(503);
  expect((await response.json()).gap).toContain(
    "conflicting or invalid hashes",
  );
});

it("returns an empty unindexed page without inventing a finalized block hash", async () => {
  const response = await app(open()).request("/events?fromBlock=100");
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({
    events: [],
    cursor: null,
    throughBlock: 99,
    throughHash: "",
  });
});

it("rejects invalid page requests and unconfigured start blocks", async () => {
  const store = open();
  for (const value of ["", "NaN", "-1", "1.5", "9007199254740992"])
    expect(
      (await app(store).request(`/events?fromBlock=${value}`)).status,
    ).toBe(400);
  expect((await app(store, null, NaN).request("/events")).status).toBe(503);
});
