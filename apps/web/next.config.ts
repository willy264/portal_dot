import type { NextConfig } from "next";
const config: NextConfig = {
  transpilePackages:["@metermend/chain"],poweredByHeader:false,
  outputFileTracingIncludes:{"/*":["../../deployments/probe.json","../../deployments/portaldot-v3.json","../../deployments/demo-run.json"]},
  outputFileTracingExcludes:{"/*":["../../.env*","../../.secrets/**","../../.tools/**","../../deployments/accounts.json","../../deployments/budget.json","./test-artifacts/**"]},
};
export default config;
