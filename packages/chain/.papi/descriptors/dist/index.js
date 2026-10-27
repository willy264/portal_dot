import { _Enum } from 'polkadot-api';

const table = new Uint8Array(128);
for (let i = 0; i < 64; i++) table[i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i * 4 - 205] = i;
const toBinary = (base64) => {
  const n = base64.length, bytes = new Uint8Array((n - Number(base64[n - 1] === "=") - Number(base64[n - 2] === "=")) * 3 / 4 | 0);
  for (let i2 = 0, j = 0; i2 < n; ) {
    const c0 = table[base64.charCodeAt(i2++)], c1 = table[base64.charCodeAt(i2++)];
    const c2 = table[base64.charCodeAt(i2++)], c3 = table[base64.charCodeAt(i2++)];
    bytes[j++] = c0 << 2 | c1 >> 4;
    bytes[j++] = c1 << 4 | c2 >> 2;
    bytes[j++] = c2 << 6 | c3;
  }
  return bytes;
};

const descriptorValues = import('./descriptors-jLA1qiNE.js').then((module) => module["Portaldot"]);
const metadataTypes = import('./metadataTypes-Dxa_we4H.js').then(
  (module) => toBinary("default" in module ? module.default : module)
);
const extensions = {};
const requiredExtensions = {};
const getMetadata$1 = () => import('./portaldot_metadata-DrhlDwyH.js').then(
  (module) => toBinary("default" in module ? module.default : module)
);
const genesis = "0xd4f9acbcf7f52388d8b095abe3c198d19fc510e0343e643e87cfbccb155283bd";
const _allDescriptors = { descriptors: descriptorValues, metadataTypes, extensions, requiredExtensions, getMetadata: getMetadata$1, genesis };

const DigestItem = _Enum;
const Phase = _Enum;
const DispatchClass = _Enum;
const TokenError = _Enum;
const ArithmeticError = _Enum;
const TransactionalError = _Enum;
const BalanceStatus = _Enum;
const PreimagePalletHoldReason = _Enum;
const TransactionPaymentEvent = _Enum;
const ElectionProviderMultiPhaseEvent = _Enum;
const ElectionProviderMultiPhaseElectionCompute = _Enum;
const ElectionProviderMultiPhasePhase = _Enum;
const StakingRewardDestination = _Enum;
const StakingForcing = _Enum;
const GrandpaEvent = _Enum;
const PreimageEvent = _Enum;
const BagsListEvent = _Enum;
const ChildBountiesEvent = _Enum;
const NominationPoolsPoolState = _Enum;
const NominationPoolsCommissionClaimPermission = _Enum;
const NominationPoolsClaimPermission = _Enum;
const BrokerCoretimeInterfaceCoreAssignment = _Enum;
const ReferendaTypesCurve = _Enum;
const BabeDigestsNextConfigDescriptor = _Enum;
const BabeAllowedSlots = _Enum;
const BabeDigestsPreDigest = _Enum;
const BalancesTypesReasons = _Enum;
const NominationPoolsPalletFreezeReason = _Enum;
const TransactionPaymentReleases = _Enum;
const BalancesAdjustmentDirection = _Enum;
const StakingPalletConfigOpBig = _Enum;
const StakingPalletConfigOp = _Enum;
const GrandpaEquivocation = _Enum;
const IdentityData = _Enum;
const IdentityJudgement = _Enum;
const NominationPoolsBondExtra = _Enum;
const NominationPoolsConfigOp = _Enum;
const ExtensionsCheckMortality = _Enum;
const GrandpaStoredState = _Enum;
const Version = _Enum;
const PreimagesBounded = _Enum;
const PreimageOldRequestStatus = _Enum;
const PreimageRequestStatus = _Enum;
const ChildBountyStatus = _Enum;
const TransactionValidityUnknownTransaction = _Enum;
const TransactionValidityTransactionSource = _Enum;
const MmrPrimitivesError = _Enum;

const metadatas = { ["0xedc03c9dc81d39fea5c02893cc34cf2ec898d55d7ee8f8e89eb27597a724c7c2"]: _allDescriptors };
const getMetadata = async (codeHash) => {
  try {
    return await metadatas[codeHash].getMetadata();
  } catch {
  }
  return null;
};

export { ArithmeticError, BabeAllowedSlots, BabeDigestsNextConfigDescriptor, BabeDigestsPreDigest, BagsListEvent, BalanceStatus, BalancesAdjustmentDirection, BalancesTypesReasons, BrokerCoretimeInterfaceCoreAssignment, ChildBountiesEvent, ChildBountyStatus, DigestItem, DispatchClass, ElectionProviderMultiPhaseElectionCompute, ElectionProviderMultiPhaseEvent, ElectionProviderMultiPhasePhase, ExtensionsCheckMortality, GrandpaEquivocation, GrandpaEvent, GrandpaStoredState, IdentityData, IdentityJudgement, MmrPrimitivesError, NominationPoolsBondExtra, NominationPoolsClaimPermission, NominationPoolsCommissionClaimPermission, NominationPoolsConfigOp, NominationPoolsPalletFreezeReason, NominationPoolsPoolState, Phase, PreimageEvent, PreimageOldRequestStatus, PreimagePalletHoldReason, PreimageRequestStatus, PreimagesBounded, ReferendaTypesCurve, StakingForcing, StakingPalletConfigOp, StakingPalletConfigOpBig, StakingRewardDestination, TokenError, TransactionPaymentEvent, TransactionPaymentReleases, TransactionValidityTransactionSource, TransactionValidityUnknownTransaction, TransactionalError, Version, getMetadata, _allDescriptors as portaldot };
