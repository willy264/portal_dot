import { expect, it } from "vitest";
import { retainedMetadata } from "../packages/chain/src/client";

it("serves retained metadata only for its exact live runtime code hash", async () => {
  const metadata = await retainedMetadata("0xedc03c9dc81d39fea5c02893cc34cf2ec898d55d7ee8f8e89eb27597a724c7c2");
  expect(metadata).toBeInstanceOf(Uint8Array);
  expect(new TextDecoder().decode(metadata!.subarray(0, 4))).toBe("meta");
  expect(await retainedMetadata("0x" + "00".repeat(32))).toBeNull();
});
