import { expect, it } from "vitest";
import {
  executorJobs,
  hasGeneratedDeck,
  operationalCards,
} from "../lib/operational-proof";

it("shows scheduled jobs without exposing callback bytes or private fields", () => {
  expect(
    executorJobs({
      jobs: [
        {
          id: "3",
          state: "scheduled",
          scheduling: "keeper",
          executeAfter: "1793470000",
          attempts: 0,
          data: "callback-bytes",
          seed: "private",
        },
        { id: "invalid" },
      ],
    }),
  ).toEqual([
    {
      id: "3",
      state: "scheduled",
      scheduling: "keeper",
      executeAfter: "1793470000",
      attempts: "0",
    },
  ]);
});

it("keeps a pending pool transaction distinct from a finalized deployment", () => {
  const cards = operationalCards({
    deploymentStatus: {
      observedAt: "2026-10-31T13:46:36Z",
      txHash: `0x${"a".repeat(64)}`,
      journal: { state: "unknown", nonce: 5, startBlock: 265122 },
      inclusion: {
        finalizedOutcome: "unknown",
        pendingPool: { matched: true },
      },
    },
  });
  expect(cards[0]?.fields).toContainEqual({
    label: "Finalized outcome",
    value: "unknown",
  });
  expect(cards[0]?.fields).toContainEqual({
    label: "In this node's pending pool",
    value: "true",
  });
  expect(JSON.stringify(cards)).not.toContain("Deployment confirmed");
});
it("uses the newest timestamped chain observation and includes both account nonces", () => {
  const cards = operationalCards({
    chainStatus: {
      observations: [
        { observedAt: "earlier", finalized: { number: 1 } },
        {
          observedAt: "latest",
          finalized: { number: 2 },
          account: { finalizedNonce: 5, bestNonce: 5, nextIndex: 6 },
        },
      ],
    },
  });
  expect(cards[1]?.observedAt).toBe("latest");
  expect(cards[1]?.fields).toContainEqual({
    label: "Account next index (includes pool)",
    value: "6",
  });
});
it("publishes only selected fields and strips URL credentials and query strings", () => {
  const cards = operationalCards({
    hosting: {
      status: "pending",
      endpoint: "https://example.com/health?token=secret",
      seed: "private-seed",
    },
    notifications: { token: "bot-secret", chat: "private-chat" },
    rpcDiscovery: { verifiedEndpoint: "https://user:password@example.com/" },
  });
  const rendered = JSON.stringify(cards);
  for (const secret of [
    "secret",
    "private-seed",
    "bot-secret",
    "private-chat",
    "password",
  ])
    expect(rendered).not.toContain(secret);
  expect(
    cards.find(
      (card) => card.title === "Persistent worker and evidence hosting",
    )?.fields,
  ).toContainEqual({
    label: "Public service",
    value: "https://example.com/health",
  });
});
it("does not promote credentials or generated files to delivered messages or published video", () => {
  const cards = operationalCards({
    notifications: { status: "credentials-verified" },
    submission: { deck: { status: "generated" } },
  });
  expect(
    cards.find((card) => card.title === "Telegram delivery")?.fields,
  ).toContainEqual({
    label: "Delivered event types",
    value: "None recorded",
  });
  expect(
    cards.find((card) => card.title === "Submission materials")?.fields,
  ).toContainEqual({
    label: "Video",
    value: "Pending; no uploaded video recorded",
  });
});
it("links the deck only when its generated record and actual file both exist", () => {
  expect(hasGeneratedDeck({ deck: { status: "generated" } }, true)).toBe(true);
  expect(hasGeneratedDeck({ deck: { status: "generated" } }, false)).toBe(
    false,
  );
  expect(hasGeneratedDeck({ deck: { status: "pending" } }, true)).toBe(false);
});
