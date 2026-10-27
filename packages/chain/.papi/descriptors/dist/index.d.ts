import { default as portaldot, type PortaldotWhitelistEntry } from "./portaldot";
export { portaldot };
export type * from "./portaldot";
export { DigestItem, Phase, DispatchClass, TokenError, ArithmeticError, TransactionalError, BalanceStatus, PreimagePalletHoldReason, TransactionPaymentEvent, ElectionProviderMultiPhaseEvent, ElectionProviderMultiPhaseElectionCompute, ElectionProviderMultiPhasePhase, StakingRewardDestination, StakingForcing, GrandpaEvent, PreimageEvent, BagsListEvent, ChildBountiesEvent, NominationPoolsPoolState, NominationPoolsCommissionClaimPermission, NominationPoolsClaimPermission, BrokerCoretimeInterfaceCoreAssignment, ReferendaTypesCurve, BabeDigestsNextConfigDescriptor, BabeAllowedSlots, BabeDigestsPreDigest, BalancesTypesReasons, NominationPoolsPalletFreezeReason, TransactionPaymentReleases, BalancesAdjustmentDirection, StakingPalletConfigOpBig, StakingPalletConfigOp, GrandpaEquivocation, IdentityData, IdentityJudgement, NominationPoolsBondExtra, NominationPoolsConfigOp, ExtensionsCheckMortality, GrandpaStoredState, Version, PreimagesBounded, PreimageOldRequestStatus, PreimageRequestStatus, ChildBountyStatus, TransactionValidityUnknownTransaction, TransactionValidityTransactionSource, MmrPrimitivesError } from './common-types';
export declare const getMetadata: (codeHash: string) => Promise<Uint8Array | null>;
export type WhitelistEntry = PortaldotWhitelistEntry;
export type WhitelistEntriesByChain = Partial<{
    "*": WhitelistEntry[];
    portaldot: WhitelistEntry[];
}>;
