# Portaldot V3 status message

Prepared for the user to send. **Not sent by the agent.** Recheck the latest [chain observations](../deployments/chain-status-2026-10-31.json) before posting; the node resumed after the October 31 stall and MeterMend is now deployed.

> Hi Portaldot team, V3 RPC stalled intermittently on October 31 with zero peers and finality halted first at block 265122, then at 265321. Our original Cronpot deployment recovered and finalized at 265131. By November 1 at 03:26 WAT, blocks are advancing again (finalized 271395, best 271398; one peer). Our first MeterMend deployment `0xcd4488ec20cc250520bb944ffca6d21806e379dfc35e3f2aea72147cf259e782` disappeared from the pool. We verified its unused nonce and absent predicted contract, then deliberately replaced it at the same nonce. Replacement `0x23b8aa6ffcb18dbbdf12f0d1c59a33b860a43d81362b2f253efdfd43262b8f17` finalized successfully at 271379. Was the pool cleared during maintenance, and is another supported native V3 RPC available for resilience? Thank you!

Expected V3 genesis: `0xd4f9acbcf7f52388d8b095abe3c198d19fc510e0343e643e87cfbccb155283bd`.

Original Cronpot hash, finalized at block 265131: `0xd60b3e1372d10c1ce547da5f7aeadbb943ec803634a161597ef855c501a0df93`.

The October 31 stall exceeded the 45-minute escalation threshold. Public endpoint research found no verified alternate native V3 endpoint; see [RPC discovery evidence](../deployments/rpc-discovery.json). The [November 1 reconciliation](../deployments/metermend-reconciliation-2026-11-01.json) records the unchanged canonical checkpoint, unused account nonce, absent predicted contract, empty pool and bounded original-history search. No finalized failure receipt exists for the original MeterMend transaction.
