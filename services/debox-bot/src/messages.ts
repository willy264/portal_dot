import { formatUnits } from 'viem';
import type { ChainEvent } from '@metermend/service-core';

export interface ItemState { name: string; reserve: string }
export interface Notification { content: string; link: string; eventId: string }

export function itemName(uri: unknown, id: string): string {
  if (typeof uri !== 'string') return `Item #${id}`;
  try {
    const object = JSON.parse(uri.startsWith('data:application/json,') ? decodeURIComponent(uri.slice(22)) : uri);
    return typeof object.name === 'string' ? object.name.slice(0, 120) : `Item #${id}`;
  } catch { return `Item #${id}`; }
}

/** Pure reducer: persisted together with its outbox messages and block cursor. */
export function notificationFor(event: ChainEvent, previous: ItemState | undefined, baseUrl: string, decimals: number): { item: ItemState; messages: Notification[] } {
  const a = event.args;
  const id = String(a.itemId ?? '');
  const item = { ...(previous ?? { name: `Item #${id}`, reserve: '0' }) };
  const amount = (v: unknown) => `${formatUnits(BigInt(String(v ?? '0')), decimals)} tPOT`;
  const itemLink = new URL(`/items/${id}`, baseUrl).href;
  const rentalLink = new URL(`/rentals/${String(a.rentalId ?? '')}`, baseUrl).href;
  let content: string | undefined;
  let link = itemLink;
  switch (event.eventName) {
    case 'ItemRegistered': item.name = itemName(a.metadataURI, id); content = `New item: ${item.name} — rent for ${amount(a.fee)}. ${itemLink}`; break;
    case 'Rented':
      item.reserve = (BigInt(item.reserve) + BigInt(String(a.toReserve))).toString();
      content = `${item.name} rented. ${amount(a.toReserve)} went to its repair fund (now ${amount(item.reserve)}).`; link = rentalLink; break;
    case 'Returned': content = `${item.name} returned. Deposit becomes refundable at ${new Date(Number(a.refundAt) * 1000).toISOString()} unless disputed. ${rentalLink}`; link = rentalLink; break;
    case 'DepositRefunded': content = `✅ Deposit of ${amount(a.amount)} refunded for ${item.name}. Transaction: ${event.txHash}. ${new URL('/proof', baseUrl).href}`; link = rentalLink; break;
    case 'DisputeOpened': content = `⚠️ Damage claim of ${amount(a.amount)} on ${item.name}. Renter / arbiter: ${rentalLink}`; link = rentalLink; break;
    case 'DisputeResolved': item.reserve = (BigInt(item.reserve) + BigInt(String(a.deducted))).toString(); content = `⚖️ ${item.name}: ${amount(a.deducted)} to its repair fund, ${amount(a.refunded)} refunded.`; link = rentalLink; break;
    case 'RepairPaid': item.reserve = (BigInt(item.reserve) - BigInt(String(a.amount))).toString(); content = `🛠 ${item.name} repaired. ${amount(a.amount)} paid from its reserve.`; break;
  }
  const messages: Notification[] = content ? [{ content, link, eventId: event.id }] : [];
  if (event.eventName === 'Returned') messages.push({ content: `${item.name} is available again. ${itemLink}`, link: itemLink, eventId: `${event.id}:available` });
  return { item, messages };
}
