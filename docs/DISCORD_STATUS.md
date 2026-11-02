# Portaldot V3 support messages

Prepared for the user to send. **Neither message has been sent by the agent.** The current blocker is a failed nested EVM callback through native `Revive.call`; the earlier intermittent-stall message is retained below as history.

## Current: bounded EVM CALL under native Revive.call

> Hi Portaldot team — MeterMend is deployed on V3 (spec 3002), but our first Cronpot refund callback failed. Native signed `Revive.call` transaction `0x2b9249a026b3f868527e6964de6bd5241f401942f28e247d82dfb0eac9d75e35` finalized at block 271528. Replaying that actual transaction with `ReviveApi_trace_tx_versioned` shows the nested `Cronpot → MeterMend.finalizeRefund(1)` CALL returning `OutOfGas` with a 1,000,000 gas allowance, while the outer call reports gas 181762198607116 and succeeds. `JobExecuted(success=false)` was emitted; no refund occurred.
>
> Read-only constructor probes also fail with finite callback limits from 10^12 through 10^15, including simple getters. In those native simulations `gasleft()` reports `uint64.max` before and after the nested call. A `uint256.max` CALL allowance succeeds in the corresponding controls, but we have not deployed that as a workaround. Could you confirm the gas units and supported way to make a bounded EVM CALL from native `Revive.call`, any differences from Ethereum-transaction execution, and the official V3 runtime/SDK fork and commit? We can share the exact trace and non-persistent probe source. Thank you!

Diagnostic references for the ticket:

- [Actual finalized transaction trace](../deployments/cronpot-callback-diagnosis.json), replayed against parent block 271527, hash `0x890a0b46fa3eca98deedf37731622fbb59f29983d6b321af58034f1fd4ad2172`.
- Failed transaction block hash: `0x4c48aacbf687fba94bb09d227c9b96ec840b4c7c3f96ba3a3b9e502994e19ab5`.
- [Finite-limit simulations](../deployments/refund-call-finite-budget.json), observed November 1 at 02:45:17 UTC (03:45:17 WAT), finalized block 271581. The constructor deliberately reverts its diagnostic result; these probes sent zero transactions and deployed zero contracts.
- [Simple-getter and maximum-allowance controls](../deployments/refund-call-controls.json). These are simulations, not completed refunds.
- Runtime code hash: `0xedc03c9dc81d39fea5c02893cc34cf2ec898d55d7ee8f8e89eb27597a724c7c2`.
- Cronpot: `0x41635a685448cfa86da1600656f103a211e398f4`; MeterMend: `0x61382db168db646b899234cd707c7ba0142c4071`; Solidity 0.8.30, EVM bytecode, Prague target, optimizer 200 runs.

The failing job and deployment receipts are retained. No failed job was blindly retried, and no replacement deployment was created for this diagnosis. The public pre-V3 runtime source does not establish spec 3002's gas configuration. Update this draft if newer runtime controls resolve or narrow the issue before posting.

## Earlier intermittent stall

Recheck the latest chain observations before posting this older message. The node resumed after the October 31 stall and both application deployments are finalized.

> Hi Portaldot team, V3 RPC stalled intermittently on October 31 with zero peers and finality halted first at block 265122, then at 265321. Our original Cronpot deployment recovered and finalized at 265131. By November 1 at 03:26 WAT, blocks are advancing again (finalized 271395, best 271398; one peer). Our first MeterMend deployment `0xcd4488ec20cc250520bb944ffca6d21806e379dfc35e3f2aea72147cf259e782` disappeared from the pool. We verified its unused nonce and absent predicted contract, then deliberately replaced it at the same nonce. Replacement `0x23b8aa6ffcb18dbbdf12f0d1c59a33b860a43d81362b2f253efdfd43262b8f17` finalized successfully at 271379. Was the pool cleared during maintenance, and is another supported native V3 RPC available for resilience? Thank you!

Expected V3 genesis: `0xd4f9acbcf7f52388d8b095abe3c198d19fc510e0343e643e87cfbccb155283bd`.

Original Cronpot hash, finalized at block 265131: `0xd60b3e1372d10c1ce547da5f7aeadbb943ec803634a161597ef855c501a0df93`.

The October 31 stall exceeded the 45-minute escalation threshold. Public endpoint research found no verified alternate native V3 endpoint; see [RPC discovery evidence](../deployments/rpc-discovery.json). The [November 1 reconciliation](../deployments/metermend-reconciliation-2026-11-01.json) records the unchanged canonical checkpoint, unused account nonce, absent predicted contract, empty pool and bounded original-history search. No finalized failure receipt exists for the original MeterMend transaction.
