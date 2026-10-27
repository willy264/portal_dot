import { Store, type ChainEvent } from './store.js';

export interface FinalizedBlock { number: number; hash: string; timestamp: bigint; events: ChainEvent[] }
export interface BlockSource {
  head(): Promise<{ number: number; hash: string; timestamp: bigint }>;
  block(number: number): Promise<FinalizedBlock>;
}

/** A pruned or unavailable block stops the cursor. A history gap is never silently skipped. */
export class Scanner {
  gap: string | null = null;
  lastHead: { number: number; hash: string; timestamp: bigint } | null = null;
  constructor(readonly store: Store, readonly source: BlockSource, readonly startBlock: number, readonly name = 'chain') {
    if (!Number.isSafeInteger(startBlock) || startBlock < 0) throw new Error('A real deployment/start block is required');
  }
  async tick(maxBlocks = 25): Promise<void> {
    try {
      this.lastHead = await this.source.head();
      const cursor = this.store.cursor(this.name);
      const start = cursor ? cursor.block + 1 : this.startBlock;
      if (cursor && start > this.lastHead.number + 1) throw new Error('Stored cursor is ahead of this network');
      for (let n = start; n <= Math.min(this.lastHead.number, start + maxBlocks - 1); n++) {
        const block = await this.source.block(n);
        if (block.number !== n || !block.hash) throw new Error(`Block ${n} was not verified`);
        this.store.saveBlock(this.name, n, block.hash, block.events);
      }
      this.gap = null;
    } catch (error) {
      this.gap = error instanceof Error ? error.message : String(error);
      this.store.observation('ingestion-error', { message: this.gap, cursor: this.store.cursor(this.name) });
      throw error;
    }
  }
}
