import { describe, expect, it } from "vitest";
import {
  amount,
  exactAmount,
  metadata,
  parseAmount,
  safeImage,
} from "../lib/format";
import { normalizeEvents } from "../lib/history";
import { demoStatus, probeRows, transactionsFrom } from "../lib/proof";
const tx = `0x${"a".repeat(64)}`;
const block = `0x${"b".repeat(64)}`;
describe("money and untrusted metadata", () => {
  it("parses decimal reserve percentages exactly in basis points", () => {
    expect(Number(parseAmount("0.29", 2))).toBe(29);
    expect(Number(parseAmount("20.01", 2))).toBe(2001);
  });
  it("round trips editable prices without display rounding", () => {
    const original = 1234567890123456789n;
    expect(parseAmount(exactAmount(original))).toBe(original);
    expect(amount(original)).toBe("1.2345");
  });
  it("formats large balances without Number precision loss", () => {
    expect(amount(123456789012345678901234567890123456n)).toBe(
      "123,456,789,012,345,678.9012",
    );
  });
  it("rejects excess precision instead of silently rounding payable amounts", () => {
    expect(() => parseAmount("0.0000000000000000001")).toThrow("18");
    expect(() => parseAmount("1e3")).toThrow();
    expect(amount(1n)).toBe("<0.0001");
  });
  it("blocks executable URLs and preserves safe item names", () => {
    expect(safeImage("javascript:alert(1)")).toBeUndefined();
    expect(safeImage("data:text/html,hello")).toBeUndefined();
    expect(
      metadata(
        `data:application/json,${encodeURIComponent(JSON.stringify({ name: "Canon EOS camera", image: "/api/evidence/" + "a".repeat(64) }))}`,
        "1",
      ).category,
    ).toBe("camera");
  });
});
describe("persisted history and truthful proof", () => {
  it("recognizes the real demo completion timestamp without marking an incomplete run successful", () => {
    expect(demoStatus({ completedAt: "2026-10-27T12:00:00Z" })).toBe(
      "Completed (recorded)",
    );
    expect(demoStatus({ startedAt: "2026-10-27T11:00:00Z" })).toBe(
      "Started; not completed",
    );
    expect(demoStatus(null)).toBe("Not run");
    expect(demoStatus({ status: "failed" })).toBe("failed");
  });
  it("retains native scheduler events without inventing transaction hashes", () => {
    const events = normalizeEvents({
      events: [
        {
          id: "native-1",
          eventName: "DepositRefunded",
          txHash: null,
          blockHash: block,
          block: 10,
          eventIndex: 3,
          source: "substrate",
          args: { rentalId: "1", amount: "200" },
        },
      ],
    });
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      transactionHash: null,
      blockHash: block,
      eventIndex: 3,
      source: "substrate",
    });
  });
  it("keeps explicit EVM transaction evidence and scalar arguments", () => {
    expect(
      normalizeEvents([
        {
          eventName: "Rented",
          txHash: tx,
          block: 9,
          args: '{"rentalId":"1","nested":{"private":true}}',
        },
      ])[0],
    ).toMatchObject({ transactionHash: tx, args: { rentalId: "1" } });
  });
  it("does not convert unsigned probe results into successful transactions", () => {
    expect(
      transactionsFrom(
        {
          mode: "read-only",
          checks: {
            P3: {
              status: "passed",
              result: { address: "0x" + "c".repeat(40) },
            },
          },
        },
        "Probe",
      ),
    ).toEqual([]);
    expect(probeRows(null).every((row) => row.status === "not-run")).toBe(true);
  });
  it("only publishes evidence fields and skips private account branches", () => {
    const records = transactionsFrom(
      {
        steps: [
          {
            step: "rent",
            txHash: tx,
            block: 10,
            blockHash: block,
            status: "failed",
            seed: "TOP_SECRET",
          },
        ],
        accounts: { txHash: block, privateKey: "NEVER_PUBLIC" },
      },
      "Demo",
    );
    expect(records).toHaveLength(1);
    expect(records[0]?.status).toBe("failed");
    expect(JSON.stringify(records)).not.toMatch(
      /TOP_SECRET|NEVER_PUBLIC|privateKey/,
    );
  });
  it("publishes block-only native execution evidence", () => {
    expect(
      transactionsFrom(
        {
          evidence: [
            {
              eventName: "Scheduler.Dispatched",
              blockHash: block,
              block: 12,
              success: true,
            },
          ],
        },
        "Scheduler",
      )[0],
    ).toMatchObject({ txHash: null, blockHash: block, block: "12" });
  });
});
