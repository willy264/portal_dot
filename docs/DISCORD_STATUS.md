# Portaldot V3 status message

Prepared for the user to send. **Not sent by the agent.** Recheck the latest [chain observations](../deployments/chain-status-2026-10-31.json) before posting. Cronpot has now finalized; the current pending deployment is MeterMend.

> Hi Portaldot team — V3 RPC has been stalling intermittently today. At 14:46 WAT, `wss://test-node-v3.portaldot.dev` had zero peers and finality halted at block 265122. It later resumed and our original Cronpot deployment finalized at 265131. At 15:55 WAT, the node again reports zero peers, finalized block 265321 and best block 265334, unchanged for five minutes. Our next MeterMend deployment `0xcd4488ec20cc250520bb944ffca6d21806e379dfc35e3f2aea72147cf259e782` is in its pending pool (account nonce 7; nextIndex 8). Is maintenance ongoing, or is another supported native V3 RPC available? We are preserving both transaction journals and will not duplicate either deployment. Thank you!

Expected V3 genesis: `0xd4f9acbcf7f52388d8b095abe3c198d19fc510e0343e643e87cfbccb155283bd`.

Original Cronpot hash, now finalized at block 265131: `0xd60b3e1372d10c1ce547da5f7aeadbb943ec803634a161597ef855c501a0df93`.

The earlier stall exceeded the 45-minute escalation threshold. The newer stall is a separate observation window. Public endpoint research found no verified alternate native V3 endpoint; see [RPC discovery evidence](../deployments/rpc-discovery.json). This draft distinguishes Cronpot's completed recovery from the next deployment still waiting in the pool.
