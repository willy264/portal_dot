# Additional V3 test tokens for the corrected MeterMend release

The November 2 read-only [release budget](../deployments/release-v2-budget.json) requires **2,112.72 tPOT** in the operator account for the corrected deployment, two demo items, the scripted and phone demonstrations, fees and retained balance. The operator currently holds **83.49 tPOT**, so its shortfall is **2,029.23 tPOT**. The registered user wallet holds only **0.17 tPOT**. Current public balances are preserved in [release-v2-funds.json](../deployments/release-v2-funds.json).

| Budget component                                                  |     tPOT |
| ----------------------------------------------------------------- | -------: |
| Cronpot and MeterMend maximum storage, with 20% margin            | 1,394.65 |
| Quoted native deployment fees, with 20% margin                    |     1.86 |
| Two items, scripted flow, phone flow and keeper balance allowance |   691.20 |
| Operator retained balance                                         |    25.00 |
| Total operator budget                                             | 2,112.72 |

The later-flow allowance is conservative planning based on observed costs and explicitly labeled estimates. It assumes no storage refunds. It does not claim that the phone demonstration or remaining scripted steps have run.

Ready for the user to paste into a Portaldot support ticket. **Prepared only; not sent by the agent.**

> Hello Portaldot team! MeterMend has live V3 contracts and a verified rental/return, but our first Cronpot refund job failed because its callback gas cap was too low for V3's runtime accounting. We preserved the failed transaction and diagnosed it with the actual trace. The corrected configurable gas profile now passes a full read-only runtime simulation, including JobExecuted(success=true) and DepositRefunded. We need a new, explicitly versioned contract release because the existing contracts are immutable. Could you provide 2,200 tPOT to the dedicated project deployer **5Gn8dCfyVQkKzoidcXXfncDR6amfmp5zVxFiXidsdzrZH3uB**? The reviewed deployment and demonstration budget is 2,112.72 tPOT; that account currently has 83.49 tPOT. This is Portaldot V3 testnet, chain ID 420420777. Budget evidence: https://github.com/willy264/portal_dot/blob/main/deployments/release-v2-budget.json . Corrected simulation evidence: https://github.com/willy264/portal_dot/blob/main/deployments/cronpot-candidate-full-simulation.json . Thank you!

The requested destination above is a public account address. No private key or recovery phrase is needed. Existing deployments and the failed refund job remain preserved; the corrected simulation did not deploy a contract or refund the renter.
