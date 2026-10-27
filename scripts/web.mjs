import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "dotenv";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

// These are server configuration inputs, not an arbitrary NEXT_PUBLIC_* pass-through.
const webKeys = [
  "APP_URL",
  "PUBLIC_APP_URL",
  "WSS_URL",
  "EVM_RPC_URL",
  "RELAYER_URL",
  "CHAIN_INDEXER_URL",
  "METERMEND_ADDRESS",
  "CRONPOT_ADDRESS",
  "DEPLOYMENTS_DIR",
  "WEB_EVIDENCE_DIR",
  "EVIDENCE_BACKEND_URL",
  "EVIDENCE_BACKEND_TOKEN",
];
// Build from an allowlist rather than copying the host environment and deleting
// known seeds: CI and shells can hold other credentials that Next does not need.
const hostKeys = [
  "PATH",
  "Path",
  "SystemRoot",
  "SYSTEMROOT",
  "WINDIR",
  "windir",
  "COMSPEC",
  "ComSpec",
  "PATHEXT",
  "HOME",
  "USERPROFILE",
  "APPDATA",
  "LOCALAPPDATA",
  "TEMP",
  "TMP",
  "TMPDIR",
  "XDG_CACHE_HOME",
  "XDG_CONFIG_HOME",
  "XDG_DATA_HOME",
  "XDG_RUNTIME_DIR",
  "LANG",
  "LC_ALL",
  "LC_CTYPE",
  "TZ",
  "TERM",
  "COLORTERM",
  "FORCE_COLOR",
  "NO_COLOR",
  "CI",
  "PORT",
  "HOSTNAME",
  "NODE_ENV",
  "NEXT_TELEMETRY_DISABLED",
  "VERCEL",
  "VERCEL_ENV",
  "VERCEL_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
  "HTTP_PROXY",
  "HTTPS_PROXY",
  "ALL_PROXY",
  "NO_PROXY",
  "http_proxy",
  "https_proxy",
  "all_proxy",
  "no_proxy",
  "SSL_CERT_FILE",
  "SSL_CERT_DIR",
  "NODE_EXTRA_CA_CERTS",
];

function rootEnvironment(rootDirectory) {
  try {
    return readFileSync(join(rootDirectory, ".env"), "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}

/** Pure construction; parsing the project file never mutates process.env. */
export function webEnvironment({
  rootDirectory = projectRoot,
  hostEnvironment = process.env,
  envContents = rootEnvironment(rootDirectory),
} = {}) {
  const configured = parse(envContents);
  const environment = {};
  for (const key of hostKeys) {
    if (hostEnvironment[key] !== undefined)
      environment[key] = hostEnvironment[key];
  }
  for (const key of webKeys) {
    const value = hostEnvironment[key] ?? configured[key];
    if (value !== undefined) environment[key] = value;
  }
  // The root example uses APP_URL; the web's public configuration uses PUBLIC_APP_URL.
  if (!environment.PUBLIC_APP_URL && environment.APP_URL)
    environment.PUBLIC_APP_URL = environment.APP_URL;
  for (const key of ["WEB_EVIDENCE_DIR", "DEPLOYMENTS_DIR"]) {
    if (environment[key] && !isAbsolute(environment[key]))
      environment[key] = resolve(rootDirectory, environment[key]);
  }
  environment.DEPLOYMENTS_DIR ||= resolve(rootDirectory, "deployments");
  return environment;
}

export function webLaunchPlan(argv, options = {}) {
  const rootDirectory = options.rootDirectory ?? projectRoot;
  const webDirectory = resolve(rootDirectory, "apps/web");
  const requireWeb = createRequire(join(webDirectory, "package.json"));
  return {
    command: process.execPath,
    args: [
      requireWeb.resolve("next/dist/bin/next"),
      ...(argv.length ? argv : ["dev"]),
    ],
    options: {
      cwd: webDirectory,
      env: webEnvironment({ ...options, rootDirectory }),
      stdio: "inherit",
      windowsHide: true,
    },
  };
}

export function launchWeb(argv = process.argv.slice(2)) {
  const plan = webLaunchPlan(argv);
  const child = spawn(plan.command, plan.args, plan.options);
  const signals = ["SIGINT", "SIGTERM"];
  const handlers = new Map(
    signals.map((signal) => [
      signal,
      () => {
        if (!child.killed) child.kill(signal);
      },
    ]),
  );
  for (const [signal, handler] of handlers) process.on(signal, handler);
  const cleanup = () => {
    for (const [signal, handler] of handlers) process.off(signal, handler);
  };
  child.once("error", (error) => {
    cleanup();
    console.error(`Unable to start the web app: ${error.message}`);
    process.exitCode = 1;
  });
  child.once("exit", (code, signal) => {
    cleanup();
    process.exitCode = code ?? (signal === "SIGINT" ? 130 : 143);
  });
  return child;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    launchWeb();
  } catch (error) {
    console.error(`Unable to configure the web app: ${error.message}`);
    process.exitCode = 1;
  }
}
