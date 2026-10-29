import type {
  ContractFunctionArgs,
  ContractFunctionName,
  ContractFunctionReturnType,
} from "viem";
import { meterMendAbi } from "./abi";
import type { Hex } from "./types";
type ReadName = ContractFunctionName<typeof meterMendAbi, "view">;
export type FinalizedSnapshot = {
  number: number;
  hash: string;
  timestamp: bigint;
};
type ChainReader = Pick<typeof import("@metermend/chain"), "readContract">;
/** The ABI supplies tuple types; every view is pinned to the same finalized native block. */
export function snapshotReader(
  chain: ChainReader,
  address: Hex,
  at: FinalizedSnapshot,
) {
  return <N extends ReadName>(
    name: N,
    args?: ContractFunctionArgs<typeof meterMendAbi, "view", N>,
  ): Promise<ContractFunctionReturnType<typeof meterMendAbi, "view", N>> =>
    chain.readContract(
      meterMendAbi,
      address,
      name,
      Array.isArray(args) ? args : [],
      { at },
    );
}
