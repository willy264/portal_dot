# Live direct-refund recovery

The existing-contract direct recovery completed on November 3, 2026. Rental 1 refunded **0.05 tPOT** through a direct keeper call. The second rental contributed **0.002 tPOT** to the reserve; its approved dispute added **0.015 tPOT** and refunded **0.035 tPOT**. The approved repair paid **0.0095 tPOT**. Income withdrawal paid **0.016 tPOT**, leaving the **0.0095 tPOT** reserve unchanged. A signed unauthorized repair approval finalized with `Revive.ContractReverted`; its live simulation decoded `NotArbiter` and the reserve/repair state stayed unchanged.

The original Cronpot callback remains a failed live attempt (OutOfGas). The successful refund was direct, not successful Cronpot execution. Corrected Cronpot passes 49 tests but is not deployed. MeterMend was not changed or redeployed. The 2,200 tPOT top-up arrived; recovery still stayed within the separate 83.49 tPOT cap.

| Step | Transaction | Block | Fee tPOT | New storage held tPOT | Value tPOT |
| --- | --- | ---: | ---: | ---: | ---: |
| Direct keeper refund | `0x53739d89deade004318a522a9517e97dc103432c73aad50f226cf6606ad523a7` | 311559 | 0.01851166742868 | 0 | 0 |
| Second rental | `0xadbf4bcdebde6cd209bc9f7e7337e0539389500c3511aeb372eda87ac032276e` | 311944 | 0.01911557879971 | 19.2075 | 0.06 |
| Atomic return and dispute | `0x8334168734195084b296cc894e5db67454211e62cba5902aafa4099a71811539` | 311948 | 0.03693391118196 | 34.5735 | 0.001 |
| Arbiter approves deduction | `0x93339980a2a8a6be74f1bd5dfd9911a7e7db171d90e3570ac43b5fc1b9621df5` | 311952 | 0.02181422393831 | 0 | 0 |
| Repair proposal | `0xbe3562ed2da7c14d43516299b61ba8c4ce316645033071ba362bfc83643ec7df` | 311957 | 0.02821192003563 | 15.366 | 0 |
| Arbiter approves repair | `0x055af7ced3d7504d8dbc72b93fe438c8b9469d25211b2ea23e5b99d7f9d679be` | 311961 | 0.02181174137856 | 3.8415 | 0 |
| Income withdrawal | `0x0f8dc5da23b5bc24c1e496da7b7cddb5cd20683fcd0b4f8d89579ae246743134` | 311966 | 0.01530933064561 | 0 | 0 |
| Unauthorized reserve spending rejected | `0x4882c3c260dca2c76c03f6fb6bbffe541e7656b2788e1e2fbd666169dd7fc3ed` | 311970 | 0.02180732110382 | 0 | 0 |

Conservative total: **73.23301569451228 tPOT**, including fees, gross new storage holds and 0.061 tPOT input value. Storage refunds, deposit refunds and incoming transfers are not credited against the cap. Remaining allowance: **10.25698430548772 tPOT**. The combined return/dispute has one actual fee and transaction hash.

Full events, state assertions and role balances: [demo-run.json](../deployments/demo-run.json). Original callback trace and old-budget breakdown: [REFUND_DIAGNOSIS.md](REFUND_DIAGNOSIS.md). All images are labeled demo fixtures. The renter also served as the demo repair provider; the arbiter was distinct.

Still outstanding: successful corrected Cronpot automation, durable always-on public services under the free-hosting constraint, real phone/printed-QR rehearsal, actual Telegram group screenshots, recording/voiceover/upload and final BUIDL submission.
