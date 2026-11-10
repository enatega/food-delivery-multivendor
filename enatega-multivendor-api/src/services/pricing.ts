import { distanceKm } from '../lib/geo.js';
import { round2 } from '../lib/query.js';
import type { ConfigurationDoc } from '../models/index.js';

/**
 * Delivery fee. Matches the customer apps' formula so displayed and charged
 * amounts agree: `fixed` -> flat deliveryRate, otherwise ceil(km) * deliveryRate
 * (never below deliveryRate). A store-level fee (deliveryInfo) overrides it.
 */
export function deliveryFee(
  cfg: Pick<ConfigurationDoc, 'costType' | 'deliveryRate'>,
  restaurant: { location?: { coordinates?: number[] | null } | null; deliveryInfo?: { deliveryFee?: number | null; minDeliveryFee?: number | null; deliveryDistance?: number | null } | null },
  dest: { lat: number; lng: number },
): number {
  const c = restaurant.location?.coordinates;
  const km = c && c.length === 2 ? distanceKm(c[1]!, c[0]!, dest.lat, dest.lng) : 0;
  const info = restaurant.deliveryInfo;
  if (info && typeof info.deliveryFee === 'number' && info.deliveryFee > 0) {
    // Store fee: base fee covers `deliveryDistance` km, each extra km costs the base fee pro-rata.
    const base = info.deliveryFee;
    const includedKm = info.deliveryDistance && info.deliveryDistance > 0 ? info.deliveryDistance : Infinity;
    const extra = km > includedKm ? Math.ceil(km - includedKm) * (base / Math.max(includedKm, 1)) : 0;
    return round2(Math.max(base + extra, info.minDeliveryFee ?? 0));
  }
  const rate = Number(cfg.deliveryRate) || 0;
  const amount = cfg.costType === 'fixed' ? rate : Math.ceil(km) * rate;
  return round2(amount > 0 ? amount : rate);
}

export interface PricedLine {
  unitPrice: number;
  quantity: number;
  dealDiscount?: number;
}

export interface OrderTotals {
  itemsSubTotal: number;
  couponDiscount: number;
  discountedSubtotal: number;
  deliveryCharges: number;
  taxationAmount: number;
  tipping: number;
  serviceFee: number;
  orderAmount: number;
}

/** Same formula as enatega-multivendor-app/src/utils/orderPricing.js (server-authoritative). */
export function computeTotals(input: {
  lines: PricedLine[];
  couponPercent?: number;
  couponFlat?: number;
  taxPercent?: number;
  delivery?: number;
  tip?: number;
  serviceFee?: number;
}): OrderTotals {
  const itemsSubTotal = round2(input.lines.reduce((s, l) => s + l.unitPrice * l.quantity - (l.dealDiscount ?? 0), 0));
  const couponDiscount = round2(Math.min(itemsSubTotal, input.couponFlat ?? ((input.couponPercent ?? 0) / 100) * itemsSubTotal));
  const discountedSubtotal = round2(itemsSubTotal - couponDiscount);
  const deliveryCharges = round2(input.delivery ?? 0);
  const taxationAmount = round2(((discountedSubtotal + deliveryCharges) / 100) * (input.taxPercent ?? 0));
  const tipping = round2(Math.max(input.tip ?? 0, 0));
  const serviceFee = round2(input.serviceFee ?? 0);
  return {
    itemsSubTotal,
    couponDiscount,
    discountedSubtotal,
    deliveryCharges,
    taxationAmount,
    tipping,
    serviceFee,
    orderAmount: round2(discountedSubtotal + deliveryCharges + taxationAmount + tipping + serviceFee),
  };
}
