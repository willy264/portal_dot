// Render Free has ephemeral storage. It may serve retained proof but must not sign.
process.env.READ_ONLY = "1";
process.env.RELAYER_SEED = "";
process.env.EVIDENCE_READ_ONLY = "1";
process.env.PREVIEW_SNAPSHOT = "1";
process.env.STORAGE_MODE = "ephemeral-free-preview";
process.env.START_BLOCK = "271379";
process.env.CHAIN_TIMEOUT_MS = "120000";
await import("./index.js");
export {};
