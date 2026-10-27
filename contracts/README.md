# MeterMend contracts

Compile with Solidity 0.8.30, Prague EVM, optimizer enabled with 200 runs:

```sh
forge build --sizes
forge test -vvv
forge fmt --check
```

The tests include the required business flows from `../SPEC.md`, full-range fee-split fuzzing, multiple-item accounting, recipient failures, reentrancy, unresolved-rental transfers and scheduler failure cases. The minimal test helper calls Foundry cheatcodes directly, so no vendored test library or git submodule is needed.

## Accounting and authority

MeterMend's native balance must cover the sum of outstanding rental deposits, each item's repair reserve, and all withdrawable operator income. Rental fees are allocated immediately; deposits remain separate liabilities. Transfers carry an item's reserve and history, while earned income stays with the operator who earned it. `unsettledRentals` prevents an ownership change from changing authority over a returned or disputed rental. A physically returned item can be rented again before an older deposit closes.

Cancellation tips returned by Cronpot and unsolicited payments are unallocated surplus. They are not added to a reserve or to operator income, and there is no administrative surplus-withdrawal function.

The operator's deduction proposal supplies one approval; the renter or the distinct arbiter may provide the second. Both rejecting closes with a full refund. There is no timeout for a disputed deposit. Refunds are checked push payments: refusal reverts that settlement and retains its deposit liability and transfer lock. A fully deducted deposit makes no zero-value external payment. Repair approval rechecks the current reserve, so competing proposals cannot spend more than the reserve holds.

## Cronpot execution bounds

`schedule`, `cancel`, `execute` and `withdrawTipCredit` share a reentrancy guard. Each job funds its own tip. Execution consumes the job's eligibility and tip before invoking its target. A target revert or exhaustion of its allowance produces terminal `Failed` status; failed jobs are not automatically retried. A refund finalized directly may therefore leave a Cronpot job whose later execution fails harmlessly.

Execution constants are public getters:

| Constant | Value | Purpose |
|---|---:|---|
| `TARGET_GAS_LIMIT` | 1,000,000 | Maximum gas passed to the target |
| `POST_CALL_GAS_RESERVE` | 100,000 | Retained settlement and event budget |
| `TIP_GAS_LIMIT` | 30,000 | Maximum explicit gas for immediate executor payment |
| `MAX_RETURN_DATA` | 4,096 bytes | Maximum returned/reverted data copied and emitted |
| `MIN_CALL_GAS` | 1,125,873 | Required gas immediately before the bounded call, including EIP-150 and CALL overhead |

The transaction must also cover dispatch, calldata/storage preparation and its intrinsic gas. An underfunded invocation reverts before any job consumption becomes persistent. `JobExecuted.returnData` contains a bounded prefix; `ReturnDataTruncated` reports the original and copied lengths when truncation occurs. A rejecting or gas-consuming executor does not revert target completion: its tip becomes `tipCredits[executor]`, withdrawable through `withdrawTipCredit` once that recipient can receive payment. A failed credit withdrawal retains the credit.

`getJob(jobId)` returns the complete job including calldata for relayer recovery. No contract bytecode-introspection or CREATE2 assumptions are used. EVM unit tests establish these gas bounds locally; the bounds still require the specified V3 dry-run validation before native scheduling is advertised. More demanding workloads need a separately configured registry version.

`Ping` is a tiny payable probe and deliberately has no withdrawal method. Only the explicitly intended probe value should be sent to it.
