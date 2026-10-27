import { getApi, getBlock, getClient, getFinalizedHead, GENESIS_HASH } from '@metermend/chain';
import { Blake2256 } from '@polkadot-api/substrate-bindings';
import { decodeEventLog, hexToBytes, toHex, type Abi, type Address, type Hex } from 'viem';
import type { BlockSource, ChainEvent, FinalizedBlock } from '@metermend/service-core';

/** Native events preserve scheduler initialization events which have no signed extrinsic. */
export class SubstrateSource implements BlockSource {
  constructor(readonly contracts: Array<{ address: Address; abi: Abi }>) {}
  head = getFinalizedHead;
  async block(number: number): Promise<FinalizedBlock> {
    const block = await getBlock(number);
    const [records, body] = await Promise.all([
      getApi().query.System.Events.getValue({ at: block.hash, signal: AbortSignal.timeout(30_000) }),
      getClient()._request<{ block: { extrinsics: Hex[] } } | null>('chain_getBlock', [block.hash])
    ]);
    if (!body) throw new Error(`Block body ${number} is pruned or unavailable`);
    const events: ChainEvent[] = [];
    for (let index = 0; index < records.length; index++) {
      const record = records[index]!;
      const event = record.event;
      const extrinsic = record.phase.type === 'ApplyExtrinsic' ? body.block.extrinsics[record.phase.value] : undefined;
      const txHash = extrinsic ? toHex(Blake2256(hexToBytes(extrinsic))) : null;
      const common = { id: `${GENESIS_HASH}:${block.hash}:${index}`, network: 'portaldot-v3-testnet', txHash, block: number, blockHash: block.hash, eventIndex: index, observedAt: new Date().toISOString(), source: 'substrate' as const };
      if (event.type === 'Revive' && event.value.type === 'ContractEmitted') {
        const emitted = event.value.value;
        const contract = this.contracts.find(c => c.address.toLowerCase() === emitted.contract.toLowerCase());
        if (!contract) continue;
        const decoded = decodeEventLog({ abi: contract.abi, topics: emitted.topics as [Hex, ...Hex[]], data: toHex(emitted.data), strict: true });
        if (!decoded.eventName || !decoded.args || Array.isArray(decoded.args)) throw new Error(`ABI did not decode named event fields at block ${number}:${index}`);
        events.push({ ...common, address: emitted.contract, eventName: decoded.eventName, args: decoded.args as unknown as Record<string, unknown> });
      } else if (event.type === 'Scheduler' && (event.value.type === 'Scheduled' || event.value.type === 'Dispatched')) {
        events.push({ ...common, address: 'Scheduler', eventName: `Scheduler.${event.value.type}`, args: event.value.value as unknown as Record<string, unknown> });
      }
    }
    return { ...block, events };
  }
}
