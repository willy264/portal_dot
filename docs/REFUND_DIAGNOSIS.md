# Refund diagnosis and existing-release continuation

Observed November 3, 2026. The direct current-state refund simulation passes. No MeterMend source fix or replacement is required for this recovery. The earlier 2,112.72 tPOT plan was a new two-contract release plus two rehearsals; it was not the minimum cost of finishing the existing-contract demo.

## Exact failure boundary

The finalized keeper transaction `0x2b9249a026b3f868527e6964de6bd5241f401942f28e247d82dfb0eac9d75e35`, block 271528, did not revert at the outer `Cronpot.execute(1)` level. Its retained native transaction trace has this child frame:

```text
from: 0x41635a685448cfa86da1600656f103a211e398f4 (Cronpot)
to:   0x61382db168db646b899234cd707c7ba0142c4071 (MeterMend)
input: finalizeRefund(1)
gas: 1000000
error: OutOfGas
output: 0x
```

Cronpot catches the failed low-level call, records a terminal failed job and emits `JobExecuted(success=false, returnData=0x)`. There is no Solidity revert reason string or `TransferFailed` selector in this receipt, and no renter-transfer child call in the failed frame. The trace cannot identify a particular Solidity instruction beyond that call boundary. [Retained exact trace](../deployments/cronpot-callback-diagnosis.json).

The direct native simulation at finalized block **310727**, hash `0x99acba94b811a7d3bd86ef8ffd473548b20e80006e27c28162d7af392fcf6a40`, returned **success=true, flags=0, data=0x**, with no revert reason. The explicit bounded second simulation returned the same result. Required weight was `ref_time=1307569268`, `proof_size=75964`; maximum temporary storage was **3.8415 tPOT**, and simulated net storage was a **3.84149999999998 tPOT refund**. The deliberately conservative 5 tPOT storage cap plus quoted fee requires 5.01855166521646 tPOT available, but that is not the permanent cost. Quoted fee: **0.01855166521646 tPOT**. No state or balance override was used. [Fresh direct diagnosis](../deployments/direct-refund-diagnosis-2026-11-03.json).

The original camera already uses fee `10000000000000000` and deposit `50000000000000000` EVM units. Both, the reserve contributions, planned deduction and repair amount are exact multiples of 10,000. Registering another item would not fix the observed callback gas limit. MeterMend's `cronpot` address is immutable; a new Cronpot alone cannot replace its configured address. A standalone new Cronpot would require a separately disclosed scheduling path for this existing MeterMend.

## What changed in code

`contracts/src/MeterMend.sol` has no correction in this release. Its permissionless `finalizeRefund` checks status/deadline, closes the rental, pays the renter and emits the refund event. The existing deployed function is used directly for recovery.

The tested Cronpot correction replaces fixed target/post-call/tip constants with constructor-set immutable values, validates positive and bounded configuration, computes the minimum outer gas from those values, and returns the actual callback success from `execute`. Terminal failure, bounded return-data copying, reentrancy and deferred tips remain. All 49 contract tests pass. The corrected Cronpot has not yet been deployed; this is not live automatic-refund proof.

## The earlier 2,112.71850953521368 tPOT plan

| Allocation                                                    |                    tPOT |
| ------------------------------------------------------------- | ----------------------: |
| Cronpot deployment storage: code and initial state combined   |                387.6855 |
| MeterMend deployment storage: code and initial state combined |                774.5265 |
| 20% storage safety margin                                     |                232.4424 |
| Both deployment fee quotes, including 20% fee margin          |        1.86306236219464 |
| Register two new demo items                                   |      129.20104717301904 |
| Four rentals across scripted and phone runs                   |                     118 |
| Four returns                                                  |                     160 |
| Two dispute openings                                          |                      40 |
| Two repair proposals                                          |                      52 |
| Four arbiter decisions                                        |                      48 |
| Two signed reserve-rejection proofs                           |                      24 |
| Two income withdrawals                                        |                      12 |
| Eight native image uploads                                    |                      48 |
| Keeper working balance (reusable capital)                     |                      30 |
| Phone contingency                                             |                      30 |
| Retained operator balance                                     |                      25 |
| **Total**                                                     | **2112.71850953521368** |

The contract storage estimates combine code and initial state; the simulation artifact does not separate those two charges. The 691.20104717301904 tPOT rehearsal allowance includes the new items, transactions and working balance above. It contains conservative unmeasured future allowances; it is not an exact consumed-cost forecast. Other role top-ups were not separately added to that sum. Existing renter, arbiter and keeper balances remain available; funding those roles again is unnecessary for this recovery. [Full original budget](../deployments/release-v2-budget.json).

The least deployment spend needed for the requested direct-refund recovery is **0 tPOT**: reuse both contracts, item 1 and the funded roles. A new Cronpot alone had a 387.6855 tPOT combined storage quote, 77.5371 tPOT storage margin and 0.54472329688779 tPOT fee quote (0.65366795626535 with fee margin): a conservative 465.87626795626535 tPOT availability guard. A fresh quote would be required before deployment. It is not necessary to complete this direct-call recovery.

## Current action budget

The 2,200 tPOT funding has arrived; the operator's observed balance is 2,283.48665812789099 tPOT. This recovery still enforces the user's **83.49 tPOT cap**. Its complete per-step spending limits total **81.391 tPOT**, including conservative storage bounds, 0.5 tPOT maximum fee for each of nine calls and 0.061 tPOT contract value. Every call requires a fresh native simulation, available temporary storage balance, fee quote, nonce/pool check and flushed journal before signing. Storage refunds and incoming funds do not enlarge this cap.

Exact final charges are recorded from finalized receipts, not promised from a preflight estimate. Future dependent calls cannot be simulated against their true state until the earlier action exists. The known current-state quotes are: second rental **15.366 tPOT net storage + 0.01901761247357 fee + 0.06 value**; repair proposal **15.366 storage + 0.02811320879508 fee**; income withdrawal **0.01511009218403 fee**, with a simulated storage refund. The remaining steps are bounded by [the continuation plan](../deployments/existing-release-continuation-plan.json) and must pass their fresh quote before submission.

The original failed Cronpot transaction is preserved. A subsequent direct call by the keeper is labeled **direct refund**, never successful Cronpot execution. Existing native return evidence is retained; additional labeled fixture hashes use repository bytes and a local backup without extra native image-upload spending.
