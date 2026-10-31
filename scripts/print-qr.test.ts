import { expect, it } from "vitest";
import { encodeAbiParameters, encodeEventTopics, type Hex } from "viem";
import { meterMendAbi } from "../packages/chain/src/abi";
import { qrHTML, qrPlan } from "./print-qr";

const meter = `0x${"12".repeat(20)}` as Hex;
const operator = `0x${"34".repeat(20)}` as Hex;
const hash = `0x${"ab".repeat(32)}`;
const success = { type: "System", value: { type: "ExtrinsicSuccess" } };
const receipt = () => ({
  txHash: hash,
  block: 123,
  blockHash: hash,
  events: [success] as any[],
});
function fixtures() {
  const registration = {
    type: "Revive",
    value: {
      type: "ContractEmitted",
      value: {
        contract: meter,
        topics: encodeEventTopics({
          abi: meterMendAbi,
          eventName: "ItemRegistered",
          args: { itemId: 17n, operator },
        }),
        data: encodeAbiParameters(
          [
            { type: "address" },
            { type: "uint128" },
            { type: "uint128" },
            { type: "uint16" },
            { type: "uint32" },
            { type: "string" },
          ],
          [operator, 100n, 500n, 2000, 120, "data:application/json,{}"],
        ),
      },
    },
  };
  return {
    deployment: {
      network: "portaldot-v3-testnet",
      chainId: 420420777,
      contracts: {
        Cronpot: { ...receipt(), address: operator },
        MeterMend: { ...receipt(), address: meter },
      },
    },
    seed: {
      contract: meter,
      items: {
        camera: {
          ...receipt(),
          itemId: "17",
          name: "Synthetic <test> camera",
          events: [success, registration],
        },
      },
    },
  };
}

it("prints the actual recorded registration ID with a public HTTPS QR and escaped label", () => {
  const { deployment, seed } = fixtures();
  const plan = qrPlan(deployment, seed);
  expect(plan.labels[0]?.url).toBe("https://metermend.vercel.app/items/17");
  const html = qrHTML(plan);
  expect(html).toContain("<svg");
  expect(html).toContain("Synthetic &lt;test&gt; camera");
  expect(html).toContain("https://metermend.vercel.app/items/17");
  expect(html).not.toContain('/items/1"');
});

it("refuses labels without successful current deployment and registration evidence", () => {
  const { deployment, seed } = fixtures();
  deployment.contracts.MeterMend.events = [];
  expect(() => qrPlan(deployment, seed)).toThrow("finalized MeterMend");
  deployment.contracts.MeterMend.events = [success];
  seed.items.camera.events = [success];
  expect(() => qrPlan(deployment, seed)).toThrow("ItemRegistered");
  seed.contract = operator;
  expect(() => qrPlan(deployment, seed)).toThrow(
    "current MeterMend deployment",
  );
});

it("refuses invented or duplicate IDs and failed registration receipts", () => {
  const { deployment, seed } = fixtures();
  seed.items.camera.itemId = "18";
  expect(() => qrPlan(deployment, seed)).toThrow("does not match");
  seed.items.camera.itemId = "17";
  Object.assign(seed.items, { duplicate: seed.items.camera });
  expect(() => qrPlan(deployment, seed)).toThrow("unique real item ID");
  seed.items.camera.events.push({
    type: "System",
    value: { type: "ExtrinsicFailed" },
  } as any);
  expect(() => qrPlan(deployment, seed)).toThrow(
    "successful registration receipt",
  );
});
