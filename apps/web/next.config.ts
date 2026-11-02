import type { NextConfig } from "next";
const config: NextConfig = {
  transpilePackages: ["@metermend/chain"],
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/*": [
      "../../deployments/probe.json",
      "../../deployments/funded-probe.json",
      "../../deployments/portaldot-v3.json",
      "../../deployments/demo-run.json",
      "../../deployments/deployment-status.json",
      "../../deployments/chain-status-2026-10-31.json",
      "../../deployments/rpc-discovery.json",
      "../../deployments/hosting-status.json",
      "../../deployments/notification-status.json",
      "../../deployments/submission-materials.json",
      "../../deployments/refund-calibration-summary.json",
      "./public/metermend-pitch.pdf",
    ],
  },
  outputFileTracingExcludes: {
    "/*": [
      "../../.env*",
      "../../.secrets/**",
      "../../.tools/**",
      "../../deployments/accounts.json",
      "../../deployments/budget.json",
      "./test-artifacts/**",
    ],
  },
};
export default config;
