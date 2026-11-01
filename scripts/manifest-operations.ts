import { manifest, readJson, writeJson } from "./lib";

type Receipt = {
  txHash: string;
  block: number;
  blockHash: string;
  extrinsicIndex: number;
  events: any[];
};
type Journal = {
  steps: Record<
    string,
    { state: string; intent: any; evidence?: Receipt; signer: string }
  >;
};
function successful(receipt: Receipt | undefined): receipt is Receipt {
  return (
    !!receipt &&
    /^0x[\da-f]{64}$/i.test(receipt.txHash) &&
    /^0x[\da-f]{64}$/i.test(receipt.blockHash) &&
    Number.isSafeInteger(receipt.block) &&
    receipt.block >= 0 &&
    Number.isSafeInteger(receipt.extrinsicIndex) &&
    receipt.extrinsicIndex >= 0 &&
    receipt.events.some((raw) => {
      const e = raw.event ?? raw;
      return e.type === "System" && e.value?.type === "ExtrinsicSuccess";
    }) &&
    !receipt.events.some((raw) => {
      const e = raw.event ?? raw;
      return e.type === "System" && e.value?.type === "ExtrinsicFailed";
    })
  );
}

/** Include only confirmed operations backed by successful finalized receipts. */
export function collectManifestOperations(input: {
  funding?: Journal;
  seedJournal?: Journal;
  seed?: { contract: string; items: Record<string, any> };
  meterMend?: string;
}) {
  const funding: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(input.funding?.steps ?? {})) {
    if (entry.state !== "confirmed" || !successful(entry.evidence)) continue;
    funding[key] = {
      role: entry.intent.role,
      source: entry.signer,
      destination: entry.intent.destination,
      targetNative: entry.intent.targetNative,
      ...entry.evidence,
    };
  }
  const items: Record<string, unknown> = {};
  if (
    input.seed &&
    input.meterMend &&
    input.seed.contract.toLowerCase() === input.meterMend.toLowerCase()
  ) {
    for (const [key, item] of Object.entries(input.seed.items)) {
      const entry = input.seedJournal?.steps[`register-${key}`];
      if (
        entry?.state !== "confirmed" ||
        !successful(entry.evidence) ||
        entry.evidence.txHash !== item.txHash ||
        entry.intent.contract?.toLowerCase() !== input.meterMend.toLowerCase()
      )
        continue;
      items[key] = {
        itemId: item.itemId,
        name: item.name,
        contract: input.seed.contract,
        arbiter: entry.intent.arbiter,
        disputeWindow: entry.intent.disputeWindow,
        reserveBps: entry.intent.reserveBps,
        metadataURI: item.metadataURI,
        ...entry.evidence,
      };
    }
  }
  return { funding, items };
}

/** Rebuild this manifest section from journals; never promote pending hashes to deployments. */
export function syncManifestOperations() {
  const current = manifest();
  const operations = collectManifestOperations({
    funding: readJson<Journal>("deployments/funding-journal.json", {
      steps: {},
    }),
    seedJournal: readJson<Journal>("deployments/seed-journal.json", {
      steps: {},
    }),
    seed:
      readJson<{ contract: string; items: Record<string, any> } | null>(
        "deployments/seed.json",
        null,
      ) ?? undefined,
    meterMend: current.contracts.MeterMend?.address,
  });
  current.operations = {
    source: "confirmed transaction journals",
    ...operations,
  };
  const roles = readJson<{
    accounts: Record<string, { ss58: string; publicKey: string }>;
  }>("deployments/accounts.json", { accounts: {} });
  const observations = readJson<{
    accounts: Record<string, Record<string, unknown>>;
  }>("deployments/account-funding.json", { accounts: {} });
  current.accounts = Object.fromEntries(
    Object.entries(roles.accounts).map(([role, account]) => [
      role,
      {
        ...account,
        ...(observations.accounts[role]?.ss58 === account.ss58
          ? observations.accounts[role]
          : {}),
      },
    ]),
  );
  writeJson("deployments/portaldot-v3.json", current);
  return operations;
}
