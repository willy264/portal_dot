import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { webEnvironment, webLaunchPlan } from "./web.mjs";

describe("web launcher environment boundary", () => {
  it("loads the web allowlist but excludes every project signer and bot credential", () => {
    const secrets = {
      DEPLOYER_SEED: "deployer-test-secret",
      RENTER_SEED: "renter-test-secret",
      ARBITER_SEED: "arbiter-test-secret",
      RELAYER_SEED: "relayer-test-secret",
      DEBOX_API_KEY: "debox-test-secret",
      TELEGRAM_BOT_TOKEN: "telegram-test-secret",
      UNRELATED_CLOUD_TOKEN: "cloud-test-secret",
      NODE_OPTIONS: "--require=untrusted-hook",
    };
    const envContents = Object.entries({
      ...secrets,
      WSS_URL: "wss://example.test",
      EVIDENCE_BACKEND_TOKEN: "server-evidence-token",
    })
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");
    const environment = webEnvironment({
      hostEnvironment: secrets,
      envContents,
    });
    for (const key of Object.keys(secrets))
      expect(environment).not.toHaveProperty(key);
    expect(environment.WSS_URL).toBe("wss://example.test");
    expect(environment.EVIDENCE_BACKEND_TOKEN).toBe("server-evidence-token");
  });

  it("applies explicit host overrides without passing arbitrary host settings", () => {
    const environment = webEnvironment({
      hostEnvironment: {
        WSS_URL: "wss://host.test",
        NODE_ENV: "production",
        PORT: "3100",
        RANDOM_SECRET: "hidden",
      },
      envContents:
        "WSS_URL=wss://file.test\nEVM_RPC_URL=https://rpc.test\nPORT=9999\n",
    });
    expect(environment).toMatchObject({
      WSS_URL: "wss://host.test",
      EVM_RPC_URL: "https://rpc.test",
      NODE_ENV: "production",
      PORT: "3100",
    });
    expect(environment.RANDOM_SECRET).toBeUndefined();
  });

  it("anchors relative evidence and deployment directories to the project root", () => {
    const rootDirectory = resolve("launcher-test-project");
    const environment = webEnvironment({
      rootDirectory,
      hostEnvironment: {},
      envContents:
        "WEB_EVIDENCE_DIR=./data/evidence\nDEPLOYMENTS_DIR=./proofs\nAPP_URL=https://metermend.test\n",
    });
    expect(environment.WEB_EVIDENCE_DIR).toBe(
      resolve(rootDirectory, "data/evidence"),
    );
    expect(environment.DEPLOYMENTS_DIR).toBe(resolve(rootDirectory, "proofs"));
    expect(environment.PUBLIC_APP_URL).toBe("https://metermend.test");
  });

  it("preserves absolute storage paths and an explicit public URL", () => {
    const directory = resolve("evidence-volume");
    const environment = webEnvironment({
      hostEnvironment: {
        WEB_EVIDENCE_DIR: directory,
        PUBLIC_APP_URL: "https://public.test",
      },
      envContents: "APP_URL=https://bot-link.test\n",
    });
    expect(environment.WEB_EVIDENCE_DIR).toBe(directory);
    expect(environment.PUBLIC_APP_URL).toBe("https://public.test");
  });

  it("forwards Next arguments unchanged and runs with the web application as cwd", () => {
    const plan = webLaunchPlan(
      ["start", "--port", "3100", "--hostname", "127.0.0.1"],
      { hostEnvironment: {}, envContents: "" },
    );
    expect(plan.command).toBe(process.execPath);
    expect(plan.args.slice(1)).toEqual([
      "start",
      "--port",
      "3100",
      "--hostname",
      "127.0.0.1",
    ]);
    expect(plan.args[0]).toMatch(/next[\\/]dist[\\/]bin[\\/]next$/);
    expect(plan.options.cwd).toBe(resolve("apps/web"));
    expect(plan.options.stdio).toBe("inherit");
  });

  it("a real child cannot inherit secrets omitted from the constructed environment", () => {
    const env = webEnvironment({
      hostEnvironment: {
        PATH: process.env.PATH,
        DEPLOYER_SEED: "test-seed",
        TELEGRAM_BOT_TOKEN: "test-token",
      },
      envContents: "RENTER_SEED=file-test-seed\n",
    });
    const child = spawnSync(
      process.execPath,
      [
        "-e",
        "process.exit(['DEPLOYER_SEED','RENTER_SEED','TELEGRAM_BOT_TOKEN'].some(key=>key in process.env)?1:0)",
      ],
      { env, encoding: "utf8", windowsHide: true },
    );
    expect(child.status).toBe(0);
    expect(child.stdout).toBe("");
    expect(child.stderr).toBe("");
  });
});
