import { describe, expect, it } from 'vitest';
import { delayBlocks, keeperReady, nextDeliveryAt } from '../src/timing.js';

describe('chain timing and delivery limits', () => {
  it('rounds a deadline up and adds safety blocks instead of executing early', () => {
    expect(delayBlocks(113n, 100n, 6000)).toBe(5);
    expect(delayBlocks(99n, 100n, 6000)).toBe(2);
    expect(() => delayBlocks(100n, 0n, 0)).toThrow();
  });
  it('waits for the full keeper grace period', () => {
    expect(keeperReady(100n, 129n)).toBe(false);
    expect(keeperReady(100n, 130n)).toBe(true);
  });
  it('enforces a rolling minute across service restarts as well as one message per second', () => {
    expect(nextDeliveryAt([1000, 2000, 3000, 4000, 5000], 6000)).toBe(61000);
    expect(nextDeliveryAt([1000, 2000, 3000, 4000, 5000], 61000)).toBe(61000);
    expect(nextDeliveryAt([1000], 1100)).toBe(2000);
  });
});
