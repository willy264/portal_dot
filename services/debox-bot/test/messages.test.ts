import { expect, it } from "vitest";
import { notificationFor, itemName } from "../src/messages.js";
import type { ChainEvent } from "@metermend/service-core";

const event = (
  eventName: string,
  args: Record<string, unknown>,
): ChainEvent => ({
  id: "id",
  network: "v3",
  address: "contract",
  eventName,
  args,
  txHash: "tx",
  block: 1,
  blockHash: "hash",
  eventIndex: 0,
  observedAt: "",
  source: "substrate",
});
it("uses reserve credits and approved deductions without treating deposits as income", () => {
  const rented = notificationFor(
    event("Rented", {
      itemId: "1",
      toReserve: "20",
      fee: "100",
      deposit: "500",
    }),
    { name: "Camera", reserve: "7" },
    "https://example.com",
    0,
  );
  expect(rented.item.reserve).toBe("27");
  expect(rented.messages[0]?.content).toContain("20 tPOT");
  const disputed = notificationFor(
    event("DisputeResolved", { itemId: "1", deducted: "30", refunded: "470" }),
    rented.item,
    "https://example.com",
    0,
  );
  expect(disputed.item.reserve).toBe("57");
});
it("derives availability from physical return and does not call a manual refund automatic", () => {
  const returned = notificationFor(
    event("Returned", { itemId: "1", rentalId: "2", refundAt: 1000 }),
    undefined,
    "https://example.com",
    0,
  );
  expect(returned.messages).toHaveLength(2);
  expect(returned.messages[1]?.eventId).toBe("id:available");
  const refund = notificationFor(
    event("DepositRefunded", { itemId: "1", amount: "100" }),
    undefined,
    "https://example.com",
    0,
  );
  expect(refund.messages[0]?.content).not.toContain("automatically");
  expect(
    itemName(
      "data:application/json," + encodeURIComponent('{"name":"Canon EOS"}'),
      "1",
    ),
  ).toBe("Canon EOS");
});
