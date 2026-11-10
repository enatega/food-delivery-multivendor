import { Types } from 'mongoose';
import { z } from 'zod';
import { defineModule } from '../graphql/module.js';
import type { GraphQLContext } from '../graphql/context.js';
import { looseEnum, objectId, optBool, optNum, optStr } from '../graphql/zod.js';
import { optionalCustomer, requireAdmin, requireCustomer, requireRestaurantAccess } from '../auth/guards.js';
import { env } from '../config/env.js';
import { randomToken, shortCode } from '../lib/crypto.js';
import { badInput, conflict, must, notFound } from '../lib/errors.js';
import { distanceKm } from '../lib/geo.js';
import { kv } from '../lib/kv.js';
import { ordersPlaced } from '../lib/metrics.js';
import { pageArgs, round2, searchRegex } from '../lib/query.js';
import {
  ACTIVE_STATUSES,
  Addon,
  Banner,
  Cart,
  Category,
  Coupon,
  CreditRecord,
  Feedback,
  Food,
  FoodDeal,
  Option,
  Order,
  Restaurant,
  SubCategory,
  SubscriptionPlan,
  User,
  type UserDoc,
} from '../models/index.js';
import { point } from '../models/common.js';
import { audit } from '../services/audit.js';
import { getConfig } from '../services/config.js';
import { buildOrderItems, computeEta, nextOrderNumber } from '../services/orders.js';
import { getStripe } from '../services/payments.js';
import { deliveryFee } from '../services/pricing.js';
import {
  activeDealFilter,
  activeDealsFor,
  applyDeal,
  catalogVersion,
  dealForVariation,
  dealView,
  getSingleVendorStore,
  isId,
  productViews,
  PUBLIC_FOOD,
} from '../services/single-vendor.js';
import { findValidCoupon } from './catalog.js';
import { announceNewOrder, assertPaymentConfigured, normalizePaymentMethod, type PlaceOrderArgs } from './orders.js';

// ----------------------------------------------------------------------------- inputs
const AddonSel = z.object({ _id: objectId, options: z.array(objectId).max(50).default([]) });

const CartInput = z.object({
  food: z
    .array(
      z.object({
        _id: objectId,
        categoryId: optStr(40),
        specialInstructions: optStr(500),
        variation: z.object({ _id: objectId, addons: z.array(AddonSel).max(30).nullish().transform((v) => v ?? []), count: z.coerce.number().int().min(1).max(100) }),
      }),
    )
    .min(1)
    .max(50),
});

const EditCartItemInput = z.object({
  cartItemId: objectId,
  foodId: objectId,
  categoryId: optStr(40),
  variationId: objectId,
  addons: z.array(AddonSel).max(30).nullish().transform((v) => v ?? []),
  quantity: z.coerce.number().int().min(1).max(100),
  specialInstructions: optStr(500),
  expectedCartRevision: z.coerce.number().int().optional(),
});

const UpdateCartCountInput = z.object({
  variation_id: optStr(40),
  foodId: objectId,
  categoryId: optStr(40),
  variationId: optStr(40),
  action: looseEnum(['increase', 'decrease', 'delete'] as const).optional(),
  count: z.coerce.number().int().min(0).max(100),
});

const nutritions = z.array(z.object({ name: z.string().trim().max(80), quantity: z.preprocess((v) => (v == null ? v : String(v)), z.string().max(40)) })).max(50).optional();
const SvFood = z.object({
  restaurant: objectId,
  category: objectId,
  subCategory: optStr(40),
  title: z.string().trim().min(1).max(200),
  description: optStr(2000),
  ingredients: optStr(4000),
  usage: optStr(4000),
  nutritionDetail: optStr(4000),
  nutritions,
  image: optStr(2000),
  isActive: optBool,
  isOutOfStock: optBool,
  inventory: optNum,
  UOM: optStr(30),
  orderQuantity: z.object({ min: optNum, max: optNum }).optional(),
  variations: z
    .array(
      z.object({
        _id: optStr(40),
        id: optStr(40),
        title: z.string().trim().max(120).default(''),
        price: z.coerce.number().min(0),
        discounted: optNum,
        addons: z.array(z.string()).max(50).nullish().transform((v) => v ?? []),
        isOutOfStock: optBool,
      }),
    )
    .min(1)
    .max(50),
});
const SvFoodInput = z.object({ food: SvFood });

const DealInput = z.object({
  title: z.string().trim().min(1).max(120),
  discountType: looseEnum(['PERCENTAGE', 'FIXED'] as const).default('PERCENTAGE'),
  discountValue: z.coerce.number().min(0),
  food: objectId,
  variation: optStr(40),
  restaurant: objectId,
  section: optStr(30),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  isActive: optBool,
});

// ----------------------------------------------------------------------------- helpers
async function store() {
  return must(await getSingleVendorStore(), 'Store');
}

async function favouritesOf(ctx: GraphQLContext) {
  const user = await optionalCustomer(ctx);
  return new Set((user?.favouriteFoods ?? []).map(String));
}

async function getCart(user: UserDoc) {
  return (await Cart.findOne({ user: user._id })) ?? new Cart({ user: user._id, items: [] });
}

const sameAddons = (a: { addon?: string | null; options: string[] }[], b: { _id: string; options: string[] }[]) =>
  JSON.stringify(a.map((x) => [x.addon, [...x.options].sort()]).sort()) === JSON.stringify(b.map((x) => [x._id, [...x.options].sort()]).sort());

/** Computes the cart view with current prices and active deals. */
async function cartView(cartDoc: InstanceType<typeof Cart> | null, user?: UserDoc | null) {
  const restaurant = await getSingleVendorStore();
  const cfg = await getConfig();
  const items = cartDoc?.items ?? [];
  const foods = await Food.find({ _id: { $in: items.map((i) => i.food) }, isDeleted: { $ne: true } } as Record<string, unknown>).lean();
  const foodMap = new Map(foods.map((f) => [String(f._id), f]));
  const deals = await activeDealsFor(foods.map((f) => f._id));
  const optionIds = items.flatMap((i) => i.addons.flatMap((a) => a.options));
  const options = await Option.find({ _id: { $in: optionIds.filter(isId) } } as Record<string, unknown>).lean();
  const optMap = new Map(options.map((o) => [String(o._id), o]));

  const grouped = new Map<string, ReturnType<typeof foodEntry>>();
  function foodEntry(food: (typeof foods)[number]) {
    return { foodId: String(food._id), foodTitle: food.title, foodImage: food.image, categoryId: String(food.category), foodTotal: 0, actualFoodTotal: 0, discountedFoodTotal: 0, variations: [] as unknown[] };
  }
  const dealSummary: unknown[] = [];
  let actual = 0;
  let discounted = 0;
  for (const line of items) {
    const food = foodMap.get(String(line.food));
    if (!food) continue;
    const variation = food.variations.find((v) => String(v._id) === String(line.variation));
    if (!variation) continue;
    const addons = line.addons.flatMap((a) => a.options.map((oid) => ({ addonId: a.addon, optionId: oid, title: optMap.get(oid)?.title, price: optMap.get(oid)?.price ?? 0 })));
    const addonsTotal = round2(addons.reduce((s, a) => s + (a.price ?? 0), 0));
    const deal = dealForVariation(deals, food._id, variation._id);
    const actualUnit = round2(variation.price + addonsTotal);
    const discountedUnit = round2(applyDeal(variation.price, deal) + addonsTotal);
    const actualItemTotal = round2(actualUnit * line.quantity);
    const discountedItemTotal = round2(discountedUnit * line.quantity);
    actual += actualItemTotal;
    discounted += discountedItemTotal;
    const entry = grouped.get(String(food._id)) ?? foodEntry(food);
    entry.variations.push({
      _id: line._id,
      variationId: String(variation._id),
      variationTitle: variation.title,
      quantity: line.quantity,
      unitPrice: discountedUnit,
      actualUnitPrice: actualUnit,
      discountedUnitPrice: discountedUnit,
      addonsTotal,
      itemTotal: discountedItemTotal,
      actualItemTotal,
      discountedItemTotal,
      specialInstructions: line.specialInstructions,
      dealId: deal ? String(deal._id) : null,
      dealInfo: deal ? { id: deal._id, dealId: String(deal._id), title: deal.title, dealTitle: deal.title, discountType: deal.discountType, discountValue: deal.discountValue } : null,
      addons,
    });
    entry.actualFoodTotal = round2(entry.actualFoodTotal + actualItemTotal);
    entry.discountedFoodTotal = round2(entry.discountedFoodTotal + discountedItemTotal);
    entry.foodTotal = entry.discountedFoodTotal;
    grouped.set(String(food._id), entry);
    if (deal) {
      dealSummary.push({
        dealId: String(deal._id),
        dealTitle: deal.title,
        foodId: String(food._id),
        foodTitle: food.title,
        variationId: String(variation._id),
        variationTitle: variation.title,
        quantity: line.quantity,
        discountType: deal.discountType,
        discountValue: deal.discountValue,
        originalPrice: actualUnit,
        discountedPrice: discountedUnit,
        savingsPerUnit: round2(actualUnit - discountedUnit),
        totalSavings: round2((actualUnit - discountedUnit) * line.quantity),
      });
    }
  }
  const minOrder = restaurant?.minimumOrder ?? 0;
  const below = discounted > 0 && discounted < minOrder;
  void user;
  return {
    success: true,
    message: null as string | null,
    cartId: cartDoc?._id ?? null,
    cartRevision: cartDoc?.revision ?? 0,
    foods: [...grouped.values()],
    deals: dealSummary,
    grandTotal: round2(discounted),
    actualGrandTotal: round2(actual),
    discountedGrandTotal: round2(discounted),
    totalDiscount: round2(actual - discounted),
    hasDeals: dealSummary.length > 0,
    lowOrderFees: below ? cfg.minimumOrderFee ?? 0 : 0,
    minOrderAmount: minOrder,
    maxOrderAmount: cfg.maximumOrderAmount ?? 0,
    isBelowMinimumOrder: below,
  };
}

async function validateCartLine(foodId: string, variationId: string, addons: { _id: string; options: string[] }[]) {
  const food = await Food.findOne({ _id: foodId, ...PUBLIC_FOOD } as Record<string, unknown>).lean();
  if (!food) throw badInput('This product is no longer available.');
  const variation = food.variations.find((v) => String(v._id) === variationId);
  if (!variation) throw badInput('This product option is no longer available.');
  if (food.isOutOfStock || variation.isOutOfStock) throw badInput(`"${food.title}" is out of stock.`);
  for (const a of addons) if (!variation.addons.includes(a._id)) throw badInput('Invalid add-on selection.');
  return { food, variation };
}

async function bumpCart(cart: InstanceType<typeof Cart>) {
  cart.revision = (cart.revision ?? 0) + 1;
  const restaurant = await getSingleVendorStore();
  if (restaurant) cart.restaurant = restaurant._id;
  await cart.save();
}

interface CheckoutParams {
  isPickup?: boolean;
  lat?: number;
  lng?: number;
  coupon?: string;
  isPriority?: boolean;
}

/** Server-authoritative checkout calculation for the single-vendor cart. */
async function calculateCheckout(user: UserDoc, params: CheckoutParams) {
  const cart = await Cart.findOne({ user: user._id });
  const view = await cartView(cart, user);
  const restaurant = await store();
  const cfg = await getConfig();
  const subtotal = view.discountedGrandTotal;
  const dealDiscount = view.totalDiscount;
  let deliveryCharges = 0;
  if (!params.isPickup && typeof params.lat === 'number' && typeof params.lng === 'number') {
    deliveryCharges = deliveryFee(cfg, restaurant, { lat: params.lat, lng: params.lng });
  }
  const originalDeliveryCharges = deliveryCharges;
  const subActive = user.subscription?.status === 'active' && (!user.subscription.currentPeriodEnd || user.subscription.currentPeriodEnd > new Date());
  const subscriptionDiscount = subActive ? round2((subtotal * (user.subscription?.discountPercent ?? 0)) / 100) : 0;
  let appliedFreeDelivery = false;
  if (!params.isPickup && deliveryCharges > 0 && (user.freeDeliveries ?? 0) > 0) {
    appliedFreeDelivery = true;
    deliveryCharges = 0;
  }
  let couponDiscount = 0;
  let couponApplied = false;
  if (params.coupon) {
    const c = isId(params.coupon) ? await Coupon.findById(params.coupon).lean() : await findValidCoupon(params.coupon, String(restaurant._id));
    const valid = c && c.enabled && (c.lifeTimeActive || ((!c.startDate || c.startDate <= new Date()) && (!c.endDate || c.endDate >= new Date())));
    if (valid) {
      couponApplied = true;
      couponDiscount = round2(Math.min(subtotal - subscriptionDiscount, c.couponType === 'flat' ? c.discount : ((subtotal - subscriptionDiscount) * c.discount) / 100));
    }
  }
  const isBelowMinimumOrder = subtotal < (restaurant.minimumOrder ?? 0);
  const minimumOrderFee = isBelowMinimumOrder && subtotal > 0 ? round2(cfg.minimumOrderFee ?? 0) : 0;
  const maximumOrderAmount = cfg.maximumOrderAmount ?? 0;
  const isBelowMaximumOrder = !maximumOrderAmount || subtotal <= maximumOrderAmount;
  const serviceFee = subtotal > 0 ? round2(cfg.serviceFee ?? 0) : 0;
  const priorityDeliveryFees = params.isPriority && !params.isPickup ? round2(cfg.priorityDeliveryFee ?? 0) : 0;
  const taxable = Math.max(subtotal - subscriptionDiscount - couponDiscount, 0) + deliveryCharges;
  const taxPercentage = restaurant.tax ?? 0;
  const taxAmount = round2((taxable * taxPercentage) / 100);
  const beforeCredits = round2(Math.max(subtotal - subscriptionDiscount - couponDiscount, 0) + deliveryCharges + serviceFee + minimumOrderFee + priorityDeliveryFees + taxAmount);
  const creditsUsed = round2(Math.min(Math.max(user.credits ?? 0, 0), beforeCredits));
  const grandTotal = round2(beforeCredits - creditsUsed);
  return {
    cart,
    view,
    restaurant,
    result: {
      success: true,
      message: view.foods.length ? null : 'Your cart is empty.',
      cartId: view.cartId,
      cartRevision: view.cartRevision,
      items: view.foods.flatMap((f: any) =>
        f.variations.map((v: any) => ({
          foodId: f.foodId,
          foodTitle: f.foodTitle,
          variationId: v.variationId,
          variationTitle: v.variationTitle,
          categoryId: f.categoryId,
          quantity: v.quantity,
          unitPrice: v.unitPrice,
          addonsTotal: v.addonsTotal,
          itemTotal: v.itemTotal,
          addons: v.addons.map((a: any) => ({ id: a.optionId, addonId: a.addonId, title: a.title, price: a.price })),
        })),
      ),
      subtotal,
      deliveryCharges,
      originalDeliveryCharges,
      deliveryDiscount: round2(originalDeliveryCharges - deliveryCharges),
      serviceFee,
      minimumOrderFee,
      priorityDeliveryFees,
      taxAmount,
      taxPercentage,
      totalDiscount: round2(dealDiscount + subscriptionDiscount + couponDiscount + (originalDeliveryCharges - deliveryCharges)),
      discountDetails: { subscriptionDiscount, couponDiscount, dealDiscount, freeDeliveryApplied: appliedFreeDelivery },
      couponApplied,
      couponDiscountAmount: couponDiscount,
      creditsUsed,
      grandTotal,
      hasActiveSubscription: Boolean(subActive),
      freeDeliveriesRemaining: Math.max((user.freeDeliveries ?? 0) - (appliedFreeDelivery ? 1 : 0), 0),
      appliedFreeDelivery,
      minimumOrderAmount: restaurant.minimumOrder ?? 0,
      maximumOrderAmount,
      isBelowMinimumOrder,
      isBelowMaximumOrder,
      checkoutQuoteId: null as string | null,
      checkoutQuoteExpiresAt: null as Date | null,
    },
  };
}

function selectedAddress(user: UserDoc) {
  return user.addresses.find((a) => a.selected) ?? user.addresses[0];
}

/** Resolves `{ dayId, scheduleTimeId }` from getScheduleByDay into a delivery date. */
function scheduledDate(schedule?: { isScheduled?: boolean; dayId?: string; scheduleTimeId?: string; date?: string; startTime?: string }) {
  if (!schedule?.isScheduled) return undefined;
  const date = schedule.date ?? schedule.dayId;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return undefined;
  let start = schedule.startTime;
  if (!start && schedule.scheduleTimeId?.includes('|')) start = schedule.scheduleTimeId.split('|')[1];
  const [h = '00', m = '00'] = (start ?? '00:00').split(':');
  const d = new Date(`${date}T${h.padStart(2, '0')}:${m.padStart(2, '0')}:00`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** placeOrder without restaurant/orderInput: orders the customer's server-side cart. */
export async function placeSingleVendorOrder(ctx: GraphQLContext, args: PlaceOrderArgs) {
  const user = await requireCustomer(ctx);
  if (args.idempotencyKey) {
    const existing = await Order.findOne({ user: user._id, idempotencyKey: args.idempotencyKey });
    if (existing) return existing;
  }
  const paymentMethod = normalizePaymentMethod(args.paymentMethod);
  await assertPaymentConfigured(paymentMethod);
  const isPickedUp = Boolean(args.isPickedUp);
  const addr = args.address?.latitude !== undefined && args.address?.longitude !== undefined
    ? { label: args.address.label, deliveryAddress: args.address.deliveryAddress, details: args.address.details, lat: args.address.latitude, lng: args.address.longitude }
    : (() => {
        const a = selectedAddress(user);
        const c = a?.location?.coordinates;
        return a && c?.length === 2 ? { label: a.label, deliveryAddress: a.deliveryAddress, details: a.details, lat: c[1]!, lng: c[0]! } : undefined;
      })();
  if (!isPickedUp && !addr) throw badInput('Please add a delivery address.');

  if (args.checkoutQuoteId) {
    const quote = await kv.get(`quote:${user._id}:${args.checkoutQuoteId}`);
    if (!quote) throw conflict('Your checkout session expired. Please review your order again.');
  }
  const { cart, result, restaurant } = await calculateCheckout(user, { isPickup: isPickedUp, lat: addr?.lat, lng: addr?.lng, coupon: args.couponCode || undefined, isPriority: args.isPriority });
  if (!cart || !cart.items.length) throw badInput('Your cart is empty.');
  if (!restaurant.isAvailable) throw badInput('The store is not accepting orders right now.');
  if (!result.isBelowMaximumOrder) throw badInput('Your order exceeds the maximum order amount.');

  const items = await buildOrderItems(
    String(restaurant._id),
    cart.items.map((i) => ({
      food: String(i.food),
      variation: String(i.variation),
      quantity: i.quantity,
      addons: i.addons.map((a) => ({ _id: String(a.addon), options: a.options })),
      specialInstructions: i.specialInstructions ?? undefined,
    })),
  );
  const deals = await activeDealsFor(items.map((i) => i.food));
  const pricedItems = items.map((i) => {
    const deal = dealForVariation(deals, i.food, i.variation._id);
    return { ...i, dealDiscount: deal ? round2((i.variation.price! - applyDeal(i.variation.price!, deal)) * i.quantity) : 0 };
  });

  const orderDate = scheduledDate(args.scheduleData) ?? new Date();
  const order = new Order({
    orderId: await nextOrderNumber(String(restaurant._id)),
    restaurant: restaurant._id,
    user: user._id,
    zone: restaurant.zone,
    items: pricedItems,
    deliveryAddress: isPickedUp
      ? { label: 'Pickup', deliveryAddress: restaurant.address, details: 'Pickup from store', location: restaurant.location }
      : { label: addr!.label, deliveryAddress: addr!.deliveryAddress, details: addr!.details, location: point(addr!.lng, addr!.lat) },
    paymentMethod,
    isPickedUp,
    isPriority: Boolean(args.isPriority),
    isScheduled: orderDate.getTime() > Date.now() + 10 * 60_000,
    orderDate,
    itemsSubTotal: result.subtotal,
    couponCode: result.couponApplied ? args.couponCode : undefined,
    couponDiscount: result.couponDiscountAmount,
    discountAmount: result.totalDiscount,
    deliveryCharges: result.deliveryCharges,
    originalDeliveryCharges: result.originalDeliveryCharges,
    freeDeliveryApplied: result.appliedFreeDelivery,
    taxationAmount: result.taxAmount,
    serviceFee: result.serviceFee,
    minimumOrderFee: result.minimumOrderFee,
    priorityDeliveryFees: result.priorityDeliveryFees,
    creditsApplied: result.creditsUsed,
    tipping: 0,
    orderAmount: result.grandTotal,
    commissionRate: restaurant.commissionRate ?? 0,
    instructions: (args.instructions ?? args.specialInstructions)?.slice(0, 1000),
    expectedTime: new Date(orderDate.getTime() + (restaurant.deliveryTime ?? 30) * 60_000),
    idempotencyKey: args.idempotencyKey,
  });
  order.eta = computeEta(order, restaurant) as never;
  await order.save();
  if (result.creditsUsed > 0) {
    await User.updateOne({ _id: user._id }, { $inc: { credits: -result.creditsUsed } });
    await CreditRecord.create({ user: user._id, amount: result.creditsUsed, orderId: order.orderId, recordType: 'debit' });
  }
  if (result.appliedFreeDelivery) await User.updateOne({ _id: user._id, freeDeliveries: { $gt: 0 } }, { $inc: { freeDeliveries: -1 } });
  await Cart.updateOne({ _id: cart._id }, { items: [], $inc: { revision: 1 } });
  await Restaurant.updateOne({ _id: restaurant._id }, { $inc: { orderCount: 1 } });
  await Promise.all(items.map((i) => Food.updateOne({ _id: i.food }, { $inc: { orderCount: i.quantity, ...(typeof i.quantity === 'number' ? {} : {}) } })));
  ordersPlaced.inc({ payment_method: paymentMethod });
  await announceNewOrder(order);
  return order;
}

function orderSummary(o: any) {
  return {
    ...o,
    itemsSubTotal: o.itemsSubTotal,
    deliverChargesAmount: o.deliveryCharges,
    deliveryDiscount: round2((o.originalDeliveryCharges ?? o.deliveryCharges ?? 0) - (o.deliveryCharges ?? 0)),
    couponDiscountApplied: (o.couponDiscount ?? 0) > 0,
    minimumOrderAmount: null,
    isBelowMinimumOrder: (o.minimumOrderFee ?? 0) > 0,
    isBelowMaximumOrder: true,
    freeDeliveriesRemaining: null,
    items: (o.items ?? []).map((i: any) => ({
      ...i,
      food: i.food ? String(i.food) : null,
      foodTitle: i.title,
      foodImage: i.image,
      foodQuantity: i.quantity,
      variationTitle: i.variation?.title,
      variationImage: i.image,
      variationTotal: round2((i.unitPrice ?? i.variation?.price ?? 0) * i.quantity - (i.dealDiscount ?? 0)),
      addons: (i.addons ?? []).map((a: any) => ({ ...a, isActive: true, options: (a.options ?? []).map((op: any) => ({ ...op, isActive: true })) })),
    })),
  };
}

const adminFood = async (foods: any[]) => {
  const deals = await activeDealsFor(foods.map((f) => f._id));
  const addonIds = [...new Set(foods.flatMap((f) => f.variations.flatMap((v: any) => v.addons ?? [])))].filter(isId);
  const addons = await Addon.find({ _id: { $in: addonIds } } as Record<string, unknown>).lean();
  const addonMap = new Map(addons.map((a) => [String(a._id), a]));
  return foods.map((f) => ({
    ...f,
    id: f._id,
    variations: f.variations.map((v: any) => ({
      id: v._id,
      title: v.title,
      price: v.price,
      outofstock: Boolean(v.isOutOfStock),
      addons: (v.addons ?? []).map((id: string) => addonMap.get(id)).filter(Boolean).map((a: any) => ({ title: a.title, description: a.description, isActive: true })),
      deal: dealView(dealForVariation(deals, f._id, v._id)),
    })),
  }));
};

async function foodsPage(filter: Record<string, unknown>, ctx: GraphQLContext, skip: number, limit: number, sort: Record<string, 1 | -1> = { order: 1, createdAt: 1 }) {
  const [foods, totalCount] = await Promise.all([Food.find(filter).sort(sort).skip(skip).limit(limit).lean(), Food.countDocuments(filter)]);
  return { items: await productViews(foods as never, await favouritesOf(ctx)), totalCount, hasMore: skip + foods.length < totalCount };
}

async function dealSection(section: string, ctx: GraphQLContext, skip = 0, limit = 20) {
  const r = await store();
  const foodIds = await FoodDeal.distinct('food', activeDealFilter({ restaurant: r._id, ...(section === 'all' ? {} : { section }) }) as Record<string, unknown>);
  return foodsPage({ _id: { $in: foodIds }, restaurant: r._id, ...PUBLIC_FOOD }, ctx, skip, limit);
}

const SECTION_ALIASES: Record<string, string> = { limitedtime: 'limitedTime', limited: 'limitedTime', weekly: 'weekly', newoffers: 'newOffers', new: 'newOffers', all: 'all' };

async function stripeCustomer(user: UserDoc) {
  const stripe = await getStripe();
  if (!stripe) throw badInput('Subscriptions are not available right now.');
  if (user.stripeCustomerId) return { stripe, customerId: user.stripeCustomerId };
  const c = await stripe.customers.create({ email: user.email ?? undefined, name: user.name ?? undefined, metadata: { userId: String(user._id) } });
  user.stripeCustomerId = c.id;
  await user.save();
  return { stripe, customerId: c.id };
}

// ----------------------------------------------------------------------------- module
export const singleVendorModule = defineModule({
  name: 'single-vendor',
  inputs: {
    CartInput,
    EditSingleVendorCartItemInput: EditCartItemInput,
    UpdateCartCountInput,
    inputCreateFood: SvFoodInput,
    inputUpdateFood: SvFoodInput,
    CreateDealInput: DealInput,
    UpdateDealInput: DealInput.partial(),
    CreditRecordType: looseEnum(['credit', 'debit'] as const),
    CreatePriceInput: z.object({
      productName: z.string().trim().min(1).max(120),
      amount: z.coerce.number().positive(),
      interval: looseEnum(['day', 'week', 'month', 'year'] as const).default('month'),
      intervalCount: z.coerce.number().int().min(1).max(12).default(1),
      discountPercent: z.coerce.number().min(0).max(100).default(0),
      freeDeliveries: z.coerce.number().int().min(0).default(0),
      productId: optStr(100),
    }),
    DeactivatePriceInput: z.object({ priceId: optStr(100), id: optStr(100) }),
    CreateSubscriptionInput: z.object({ stripePriceId: z.string().min(1).max(100), paymentMethodId: z.string().min(1).max(100) }),
    UpdateSubscriptionInput: z.object({ newStripePriceId: z.string().min(1).max(100) }),
    FeedbackInput: z.object({ rating: z.coerce.number().int().min(1).max(5).optional(), comments: optStr(2000), message: optStr(2000), orderId: optStr(40), category: optStr(60) }),
    DateFilter: z.object({ starting_date: optStr(40), ending_date: optStr(40) }),
    UserTypeEnum: looseEnum(['ALL', 'RIDER', 'STORE'] as const),
    OrderTypeEnum: looseEnum(['ALL', 'DELIVERY', 'PICKUP'] as const),
    PaymentMethodEnum: looseEnum(['ALL', 'COD', 'PAYPAL', 'STRIPE'] as const),
  },
  resolvers: {
    Query: {
      singleVendorDiscovery: async (_p, args: { previewLimit?: number; dealLimit?: number }, ctx) => {
        const r = await store();
        const previewLimit = Math.min(Math.max(args.previewLimit ?? 10, 1), 50);
        const dealLimit = Math.min(Math.max(args.dealLimit ?? 10, 1), 50);
        const cats = await Category.find({ restaurant: r._id, isActive: { $ne: false } }).sort({ order: 1, createdAt: 1 }).lean();
        const favs = await favouritesOf(ctx);
        const categories = await Promise.all(
          cats.map(async (c) => {
            const filter = { category: c._id, ...PUBLIC_FOOD };
            const [foods, total] = await Promise.all([Food.find(filter).sort({ order: 1 }).limit(previewLimit).lean(), Food.countDocuments(filter)]);
            return {
              id: c._id,
              name: c.title,
              icon: c.icon,
              image: c.image,
              description: c.description,
              itemCount: total,
              viewType: c.viewType,
              items: await productViews(foods as never, favs),
              pagination: { totalItems: total, hasMore: total > foods.length, currentPage: 1, totalPages: Math.ceil(total / previewLimit) },
            };
          }),
        );
        const [limitedTime, weekly, newOffers] = await Promise.all(['limitedTime', 'weekly', 'newOffers'].map((s) => dealSection(s, ctx, 0, dealLimit)));
        return {
          banners: await Banner.find({ isActive: { $ne: false } }).sort({ order: 1, createdAt: -1 }).limit(20).lean(),
          categories: categories.filter((c) => c.itemCount > 0),
          deals: { limitedTime, weekly, newOffers },
          catalogVersion: await catalogVersion(r._id),
        };
      },
      singleVendorBanners: async (_p, args: { page?: number; limit?: number }) => {
        const { skip, limit } = pageArgs(args.page, args.limit, 20);
        return Banner.find({ isActive: { $ne: false } }).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean();
      },
      singleVendorDeals: async (_p, args: { section: string; skip?: number; limit?: number }, ctx) =>
        dealSection(SECTION_ALIASES[String(args.section).toLowerCase().replace(/[^a-z]/g, '')] ?? args.section, ctx, Math.max(args.skip ?? 0, 0), Math.min(args.limit ?? 20, 100)),
      getLimitedTimeFoodsDeals: async (_p, _a, ctx) => dealSection('limitedTime', ctx),
      getWeeklyFoodsDeals: async (_p, _a, ctx) => dealSection('weekly', ctx),
      getNewOffersFoodsDeals: async (_p, _a, ctx) => dealSection('newOffers', ctx),
      getRestaurantCategoriesSingleVendor: async () => {
        const r = await store();
        const cats = await Category.find({ restaurant: r._id, isActive: { $ne: false } }).sort({ order: 1, createdAt: 1 }).lean();
        const counts = await Food.aggregate<{ _id: unknown; n: number }>([{ $match: { restaurant: r._id, ...PUBLIC_FOOD } }, { $group: { _id: '$category', n: { $sum: 1 } } }]);
        const map = new Map(counts.map((c) => [String(c._id), c.n]));
        return cats.map((c) => ({ id: c._id, name: c.title, icon: c.icon, image: c.image, description: c.description, itemCount: map.get(String(c._id)) ?? 0, viewType: c.viewType }));
      },
      getCategoryItemsSingleVendor: async (_p, args: { categoryId: string; skip?: number; limit?: number; search?: string }, ctx) => {
        const c = must(await Category.findById(args.categoryId).lean(), 'Category');
        const limit = Math.min(Math.max(args.limit ?? 20, 1), 100);
        const skip = Math.max(args.skip ?? 0, 0);
        const filter: Record<string, unknown> = { category: c._id, ...PUBLIC_FOOD };
        const re = searchRegex(args.search);
        if (re) filter.title = re;
        const page = await foodsPage(filter, ctx, skip, limit);
        return {
          categoryId: c._id,
          categoryName: c.title,
          items: page.items,
          pagination: { currentPage: Math.floor(skip / limit) + 1, totalPages: Math.max(Math.ceil(page.totalCount / limit), 1), totalItems: page.totalCount, hasMore: page.hasMore },
        };
      },
      getCategoryProducts: async (_p, args: { pagination?: { skip: number; limit: number }; categoryId: string }, ctx) =>
        foodsPage({ category: args.categoryId, ...PUBLIC_FOOD }, ctx, args.pagination?.skip ?? 0, args.pagination?.limit ?? 20),
      getAllCategoriesWithSubCategoriesDataSeeAllSingleVendor: async (_p, _a, ctx) => categoriesWithSubs(ctx, true),
      getAllCategoriesWithSubCategoriesOnlySeeAllSingleVendor: async (_p, _a, ctx) => categoriesWithSubs(ctx, false),
      searchSingleVendorFoods: async (_p, args: { search: string; skip?: number; limit?: number }, ctx) => {
        const r = await store();
        const re = searchRegex(args.search);
        if (!re) return { items: [], totalCount: 0, hasMore: false };
        return foodsPage({ restaurant: r._id, ...PUBLIC_FOOD, $or: [{ title: re }, { description: re }] }, ctx, Math.max(args.skip ?? 0, 0), Math.min(args.limit ?? 20, 100), { orderCount: -1 });
      },
      searchFood: async (_p, { search }: { search?: string }, ctx) => {
        const r = await store();
        const re = searchRegex(search);
        if (!re) return [];
        return (await foodsPage({ restaurant: r._id, ...PUBLIC_FOOD, $or: [{ title: re }, { description: re }] }, ctx, 0, 30, { orderCount: -1 })).items;
      },
      getFoodDetails: async (_p, { foodId }: { foodId: string; categoryId?: string }, ctx) => {
        const food = must(await Food.findOne({ _id: foodId, isDeleted: { $ne: true } }).lean(), 'Product');
        const user = await optionalCustomer(ctx);
        const cart = user ? await Cart.findOne({ user: user._id }).lean() : null;
        const lines = (cart?.items ?? []).filter((i) => String(i.food) === String(food._id));
        const deals = await activeDealsFor([food._id]);
        const addonIds = [...new Set(food.variations.flatMap((v) => v.addons))].filter(isId);
        const addons = await Addon.find({ _id: { $in: addonIds } } as Record<string, unknown>).lean();
        const options = await Option.find({ _id: { $in: addons.flatMap((a) => a.options).filter(isId) } } as Record<string, unknown>).lean();
        const optMap = new Map(options.map((o) => [String(o._id), o]));
        const selectedOptions = new Set(lines.flatMap((l) => l.addons.flatMap((a) => a.options)));
        const selectedAddons = new Set(lines.flatMap((l) => l.addons.map((a) => a.addon)));
        return {
          id: food._id,
          title: food.title,
          description: food.description,
          image: food.image,
          categoryId: String(food.category),
          isPopular: food.isPopular,
          isOutOfStock: food.isOutOfStock,
          cartQuantity: lines.reduce((s, l) => s + l.quantity, 0),
          usage: food.usage,
          ingredients: food.ingredients,
          nutritionDetail: food.nutritionDetail,
          nutritions: food.nutritions,
          selectedVariationsIds: lines.map((l) => String(l.variation)),
          selectedAddonsId: lines.flatMap((l) => l.addons.map((a) => ({ _id: a.addon, options: a.options }))),
          variations: food.variations.map((v) => {
            const deal = dealForVariation(deals, food._id, v._id);
            return {
              id: v._id,
              title: v.title,
              price: v.price,
              isOutOfStock: v.isOutOfStock,
              isSelected: lines.some((l) => String(l.variation) === String(v._id)),
              cartQuantity: lines.filter((l) => String(l.variation) === String(v._id)).reduce((s, l) => s + l.quantity, 0),
              actualUnitPrice: v.price,
              discountedUnitPrice: applyDeal(v.price, deal),
              deal: dealView(deal),
              addons: v.addons
                .map((id) => addons.find((a) => String(a._id) === id))
                .filter(Boolean)
                .map((a) => ({
                  id: a!._id,
                  title: a!.title,
                  description: a!.description,
                  quantityMinimum: a!.quantityMinimum,
                  quantityMaximum: a!.quantityMaximum,
                  isSelected: selectedAddons.has(String(a!._id)),
                  options: a!.options
                    .map((oid) => optMap.get(oid))
                    .filter(Boolean)
                    .map((o) => ({ id: o!._id, title: o!.title, description: o!.description, price: o!.price, isSelected: selectedOptions.has(String(o!._id)) })),
                })),
            };
          }),
        };
      },
      getSimilarFoods: async (_p, args: { foodId: string; skip?: number; limit?: number }, ctx) => {
        const food = must(await Food.findById(args.foodId).select('category subCategory restaurant').lean(), 'Product');
        const limit = Math.min(args.limit ?? 10, 50);
        const page = await foodsPage(
          { _id: { $ne: food._id }, category: food.category, ...(food.subCategory ? { subCategory: food.subCategory } : {}), ...PUBLIC_FOOD },
          ctx,
          Math.max(args.skip ?? 0, 0),
          limit,
        );
        return { items: page.items, pagination: { totalItems: page.totalCount, hasMore: page.hasMore } };
      },
      getRecommendedFoods: async (_p, args: { foodId: string; skip?: number; limit?: number }, ctx) => {
        const food = must(await Food.findById(args.foodId).select('restaurant').lean(), 'Product');
        const page = await foodsPage({ _id: { $ne: food._id }, restaurant: food.restaurant, ...PUBLIC_FOOD }, ctx, Math.max(args.skip ?? 0, 0), Math.min(args.limit ?? 10, 50), { orderCount: -1 });
        return { items: page.items, pagination: { totalItems: page.totalCount, hasMore: page.hasMore } };
      },
      getFavoriteFoodsSingleVendor: async (_p, args: { limit?: number; skip?: number }, ctx) => {
        const user = await requireCustomer(ctx);
        const ids = (user.favouriteFoods ?? []).slice(Math.max(args.skip ?? 0, 0), Math.max(args.skip ?? 0, 0) + Math.min(args.limit ?? 50, 100));
        const foods = await Food.find({ _id: { $in: ids }, isDeleted: { $ne: true } }).lean();
        const views = await productViews(foods as never, new Set(ids.map(String)));
        return {
          success: true,
          message: null,
          data: foods.map((f, i) => ({ ...f, isFavourite: true, categoryId: String(f.category), variations: views[i]!.variations.map((v) => ({ ...v, addons: [] })) })),
        };
      },
      getFavoriteFoodsStatus: async (_p, { foodId }: { foodId?: string }, ctx) => {
        const user = await optionalCustomer(ctx);
        return { success: true, message: null, isFavorite: Boolean(user && foodId && (user.favouriteFoods ?? []).map(String).includes(foodId)) };
      },
      getUserCart: async (_p, _a, ctx) => {
        const user = await requireCustomer(ctx);
        return cartView(await Cart.findOne({ user: user._id }), user);
      },
      calculateCheckout: async (_p, args: { isPickup?: boolean; latDestination?: number; longDestination?: number; coupon?: string }, ctx) => {
        const user = await requireCustomer(ctx);
        const { result } = await calculateCheckout(user, { isPickup: args.isPickup ?? false, lat: args.latDestination, lng: args.longDestination, coupon: args.coupon });
        const quoteId = randomToken(12);
        const expires = new Date(Date.now() + 15 * 60_000);
        await kv.set(`quote:${user._id}:${quoteId}`, JSON.stringify({ grandTotal: result.grandTotal, cartRevision: result.cartRevision }), 15 * 60);
        return { ...result, checkoutQuoteId: quoteId, checkoutQuoteExpiresAt: expires };
      },
      orderDetailsPage: async (_p, { orderId }: { orderId: string }, ctx) => {
        const user = await requireCustomer(ctx);
        const filter: Record<string, unknown> = { user: user._id, ...(isId(orderId) ? { _id: orderId } : { orderId }) };
        const o = must(await Order.findOne(filter).lean(), 'Order');
        return { success: true, message: null, data: orderSummary(o), rawOrder: o };
      },
      recentActiveOrder: async (_p, _a, ctx) => {
        const user = await requireCustomer(ctx);
        const o = await Order.findOne({ user: user._id, orderStatus: { $in: ACTIVE_STATUSES } }).sort({ createdAt: -1 }).lean();
        return { success: true, message: o ? null : 'No active order', data: o ? orderSummary(o) : null, rawOrder: o };
      },
      getAllfoods: async (_p, { restaurantId }: { restaurantId: string }, ctx) => {
        await requireRestaurantAccess(ctx, restaurantId);
        return adminFood(await Food.find({ restaurant: restaurantId, isDeleted: { $ne: true } } as Record<string, unknown>).sort({ createdAt: -1 }).limit(2000).lean());
      },
      getAllfoodsPaginated: async (_p, args: { restaurantId: string; page?: number; limit?: number; search?: string }, ctx) => {
        await requireRestaurantAccess(ctx, args.restaurantId);
        const { page, limit, skip } = pageArgs(args.page, args.limit, 20);
        const filter: Record<string, unknown> = { restaurant: args.restaurantId, isDeleted: { $ne: true } };
        const re = searchRegex(args.search);
        if (re) filter.title = re;
        const [foods, total] = await Promise.all([Food.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), Food.countDocuments(filter)]);
        const cats = await Category.find({ _id: { $in: foods.map((f) => f.category) } }).select('title').lean();
        const catMap = new Map(cats.map((c) => [String(c._id), c]));
        const mapped = await adminFood(foods);
        return {
          foods: mapped.map((f: any) => ({ category: { id: f.category, title: catMap.get(String(f.category))?.title }, food: f })),
          page,
          limit,
          totalFoods: total,
          hasnext: skip + foods.length < total,
          hasprev: page > 1,
        };
      },
      getAllFoodDealsAdmin: async (_p, args: { page: number; limit: number; isActive?: boolean; search?: string; restaurantId: string }, ctx) => {
        await requireRestaurantAccess(ctx, args.restaurantId);
        const { page, limit, skip } = pageArgs(args.page, args.limit, 20);
        const filter: Record<string, unknown> = { restaurant: args.restaurantId };
        if (typeof args.isActive === 'boolean') filter.isActive = args.isActive;
        const re = searchRegex(args.search);
        if (re) filter.title = re;
        const [deals, total] = await Promise.all([FoodDeal.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), FoodDeal.countDocuments(filter)]);
        const foods = await Food.find({ _id: { $in: deals.map((d) => d.food) } }).select('title variations').lean();
        const foodMap = new Map(foods.map((f) => [String(f._id), f]));
        return {
          deals: deals.map((d) => {
            const f = foodMap.get(String(d.food));
            return { ...d, id: d._id, food: String(d.food), variation: d.variation ? String(d.variation) : null, restaurant: String(d.restaurant), foodTitle: f?.title, variationTitle: f?.variations.find((v) => String(v._id) === String(d.variation))?.title };
          }),
          total,
          page,
          limit,
        };
      },
      getAllUserCredits: async (_p, _a, ctx) => ({ credits: round2((await requireCustomer(ctx)).credits ?? 0) }),
      getUserCreditsHistory: async (_p, _a, ctx) => {
        const user = await requireCustomer(ctx);
        return CreditRecord.find({ user: user._id }).sort({ createdAt: -1 }).limit(200).lean();
      },
      getAllCreditsRecords: async (_p, { searchTerm }: { searchTerm?: string }, ctx) => {
        await requireAdmin(ctx, 'Users');
        const filter: Record<string, unknown> = {};
        const re = searchRegex(searchTerm);
        if (re) {
          const users = await User.find({ $or: [{ name: re }, { email: re }] }).select('_id').limit(200).lean();
          filter.$or = [{ user: { $in: users.map((u) => u._id) } }, { orderId: re }];
        }
        return CreditRecord.find(filter).sort({ createdAt: -1 }).limit(500).lean();
      },
      getAllSubscriptionPlans: async () => ({
        plans: (await SubscriptionPlan.find({ isActive: true }).sort({ amount: 1 }).lean()).map((p) => ({ ...p, id: p.stripePriceId ?? p._id })),
      }),
      getMyFreeDeliveries: async (_p, _a, ctx) => (await requireCustomer(ctx)).freeDeliveries ?? 0,
      getMyReferralCode: async (_p, _a, ctx) => {
        const user = await requireCustomer(ctx);
        if (!user.referralCode) {
          user.referralCode = shortCode(8);
          await user.save();
        }
        return user.referralCode;
      },
      getEstimatedDeliveryTime: async (_p, { addressId }: { addressId: string }, ctx) => {
        const user = await requireCustomer(ctx);
        const r = await store();
        const a = user.addresses.id(addressId);
        if (!a) throw notFound('Address');
        const rc = r.location?.coordinates;
        const ac = a.location?.coordinates;
        const travel = rc?.length === 2 && ac?.length === 2 ? Math.ceil((distanceKm(rc[1]!, rc[0]!, ac[1]!, ac[0]!) / 25) * 60) : 15;
        return (r.deliveryTime ?? 20) + travel;
      },
      getScheduleByDay: async () => {
        const r = await store();
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const out = [];
        for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(d.getDate() + i);
          const day = days[d.getDay()]!;
          const sched = (r.scheduleTimings ?? []).find((s) => (s.day ?? '').toUpperCase().startsWith(day));
          if (!sched || sched.isOpen === false || !sched.times?.length) continue;
          const date = d.toISOString().slice(0, 10);
          const times = sched.times
            .map((t) => ({ id: `${date}|${(t.startTime ?? []).join(':')}`, _id: t._id, startTime: t.startTime, endTime: t.endTime, maxOrder: t.maxOrder }))
            .filter((t) => i > 0 || new Date(`${date}T${String(t.startTime?.[0] ?? '00')}:00`).getTime() > Date.now());
          if (!times.length) continue;
          out.push({ date, day, dayId: date, timings: [{ id: `${date}`, times }] });
        }
        return out;
      },
      getScheduleUntilNextDayOff: async () => {
        const r = await store();
        const open = (r.openingTimes ?? []).filter((o) => o.times?.length);
        const fmt = (t: string[] | undefined | null) => (t ?? []).join(':');
        const parts = open.map((o) => `${o.day} ${o.times.map((t) => `${fmt(t.startTime)}-${fmt(t.endTime)}`).join(', ')}`);
        const sat = open.find((o) => o.day === 'SAT');
        return {
          openDaysTimes: parts.join('; '),
          openDaysString: open.map((o) => o.day).join(', '),
          saturdaySlotString: sat ? sat.times.map((t) => `${fmt(t.startTime)}-${fmt(t.endTime)}`).join(', ') : null,
        };
      },
    },
    Mutation: {
      userCartData: async (_p, { input }: { input: z.infer<typeof CartInput> }, ctx) => {
        const user = await requireCustomer(ctx);
        const cart = await getCart(user);
        for (const f of input.food) {
          const { food } = await validateCartLine(f._id, f.variation._id, f.variation.addons);
          const existing = cart.items.find((i) => String(i.food) === f._id && String(i.variation) === f.variation._id && sameAddons(i.addons as never, f.variation.addons));
          if (existing) {
            existing.quantity = Math.min(existing.quantity + f.variation.count, 100);
            if (f.specialInstructions !== undefined) existing.specialInstructions = f.specialInstructions;
          } else {
            if (cart.items.length >= 100) throw badInput('Your cart is full.');
            cart.items.push({ food: food._id, category: food.category, variation: new Types.ObjectId(f.variation._id), quantity: f.variation.count, addons: f.variation.addons.map((a) => ({ addon: a._id, options: a.options })), specialInstructions: f.specialInstructions });
          }
        }
        await bumpCart(cart);
        return cartView(cart, user);
      },
      editSingleVendorCartItem: async (_p, { input }: { input: z.infer<typeof EditCartItemInput> }, ctx) => {
        const user = await requireCustomer(ctx);
        const cart = await getCart(user);
        if (input.expectedCartRevision !== undefined && input.expectedCartRevision !== cart.revision) {
          return { ...(await cartView(cart, user)), success: false, message: 'Your cart changed on another device. It has been refreshed.' };
        }
        const line = cart.items.id(input.cartItemId);
        if (!line) return { ...(await cartView(cart, user)), success: false, message: 'This item is no longer in your cart.' };
        await validateCartLine(input.foodId, input.variationId, input.addons);
        line.set({ food: input.foodId, variation: input.variationId, quantity: input.quantity, addons: input.addons.map((a) => ({ addon: a._id, options: a.options })), specialInstructions: input.specialInstructions });
        await bumpCart(cart);
        return cartView(cart, user);
      },
      updateUserCartCount: async (_p, { input }: { input: z.infer<typeof UpdateCartCountInput> }, ctx) => {
        const user = await requireCustomer(ctx);
        const cart = await getCart(user);
        const line =
          (input.variation_id && isId(input.variation_id) ? cart.items.id(input.variation_id) : null) ??
          cart.items.find((i) => String(i.food) === input.foodId && (!input.variationId || String(i.variation) === input.variationId));
        if (!line) return { success: false, message: 'Item not found in cart', quantity: 0, itemTotal: 0, foodTotal: 0, grandTotal: (await cartView(cart, user)).grandTotal, isBelowMinimumOrder: false };
        if (input.action === 'delete' || input.count === 0) line.deleteOne();
        else line.quantity = input.count;
        await bumpCart(cart);
        const view = await cartView(cart, user);
        const food = view.foods.find((f: any) => f.foodId === input.foodId) as any;
        const v = food?.variations.find((x: any) => String(x._id) === String(line._id));
        return { success: true, message: null, quantity: v?.quantity ?? 0, itemTotal: v?.itemTotal ?? 0, foodTotal: food?.foodTotal ?? 0, grandTotal: view.grandTotal, isBelowMinimumOrder: view.isBelowMinimumOrder };
      },
      clearCart: async (_p, _a, ctx) => {
        const user = await requireCustomer(ctx);
        await Cart.updateOne({ user: user._id }, { items: [], $inc: { revision: 1 } });
        return { success: true, message: 'Cart cleared' };
      },
      toggleFavoriteFoodSingleVendor: async (_p, { id }: { id: string }, ctx) => {
        const user = await requireCustomer(ctx);
        must(await Food.exists({ _id: id }), 'Product');
        const set = new Set((user.favouriteFoods ?? []).map(String));
        const isFavorite = !set.has(id);
        if (isFavorite) set.add(id);
        else set.delete(id);
        user.set('favouriteFoods', [...set]);
        await user.save();
        return { success: true, message: isFavorite ? 'Added to favourites' : 'Removed from favourites', isFavorite };
      },
      createFoodSingleVendor: async (_p, { foodInput }: { foodInput: z.infer<typeof SvFoodInput> }, ctx) => saveSvFood(ctx, null, foodInput.food),
      updateFoodSingleVendor: async (_p, { foodId, foodInput }: { foodId: string; foodInput: z.infer<typeof SvFoodInput> }, ctx) => saveSvFood(ctx, foodId, foodInput.food),
      createFoodDeal: async (_p, { input }: { input: z.infer<typeof DealInput> }, ctx) => {
        await requireRestaurantAccess(ctx, input.restaurant);
        await assertDeal(input);
        const d = await FoodDeal.create({ ...input, variation: input.variation || undefined, section: input.section ?? 'limitedTime', isActive: input.isActive ?? true });
        return dealOut(d.toObject());
      },
      updateFoodDeal: async (_p, { id, input }: { id: string; input: Partial<z.infer<typeof DealInput>> }, ctx) => {
        const d = must(await FoodDeal.findById(id), 'Deal');
        await requireRestaurantAccess(ctx, String(d.restaurant));
        d.set(Object.fromEntries(Object.entries(input).filter(([k, v]) => v !== undefined && k !== 'restaurant')));
        await assertDeal(d.toObject() as never);
        await d.save();
        return dealOut(d.toObject());
      },
      deleteFoodDeal: async (_p, { id }: { id: string }, ctx) => {
        const d = must(await FoodDeal.findById(id), 'Deal');
        await requireRestaurantAccess(ctx, String(d.restaurant));
        await d.deleteOne();
        return { message: 'Deal deleted' };
      },
      giveUserCredits: async (_p, args: { userId: string; amount: number; orderId: string; recordType: 'credit' | 'debit' }, ctx) => {
        const p = await requireAdmin(ctx, 'Users');
        if (!(args.amount > 0)) throw badInput('Amount must be positive.');
        const delta = args.recordType === 'debit' ? -args.amount : args.amount;
        const user = must(await User.findOneAndUpdate({ _id: args.userId, ...(delta < 0 ? { credits: { $gte: -delta } } : {}) }, { $inc: { credits: delta } }, { returnDocument: 'after' }), 'User with sufficient credits');
        const rec = await CreditRecord.create({ user: user._id, amount: args.amount, orderId: args.orderId, recordType: args.recordType, createdBy: p.userType === 'RESTAURANT' ? undefined : p.id });
        await audit(ctx, 'GIVE_USER_CREDITS', 'User', args.userId, { amount: args.amount, recordType: args.recordType, orderId: args.orderId });
        return rec;
      },
      editUserCreditsHistory: async (_p, { id, amount }: { id: string; amount: number }, ctx) => {
        await requireAdmin(ctx, 'Users');
        if (!(amount >= 0)) throw badInput('Amount must be positive.');
        const rec = must(await CreditRecord.findById(id), 'Credit record');
        const sign = rec.recordType === 'debit' ? -1 : 1;
        const delta = sign * (amount - rec.amount);
        await User.updateOne({ _id: rec.user }, { $inc: { credits: delta } });
        rec.amount = amount;
        await rec.save();
        await audit(ctx, 'EDIT_USER_CREDITS', 'CreditRecord', id, { amount });
        return rec;
      },
      createPriceForProduct: async (_p, { input }: { input: { productName: string; amount: number; interval: string; intervalCount: number; discountPercent: number; freeDeliveries: number; productId?: string } }, ctx) => {
        await requireAdmin(ctx, 'Configuration');
        const stripe = await getStripe();
        let stripePriceId: string | undefined;
        let productId = input.productId;
        if (stripe) {
          const cfg = await getConfig();
          if (!productId) productId = (await stripe.products.create({ name: input.productName })).id;
          stripePriceId = (
            await stripe.prices.create({
              product: productId,
              currency: (cfg.currency ?? 'USD').toLowerCase(),
              unit_amount: Math.round(input.amount * 100),
              recurring: { interval: input.interval as 'month', interval_count: input.intervalCount },
            })
          ).id;
        }
        const plan = await SubscriptionPlan.create({ ...input, interval: input.interval as "month", productId, stripePriceId });
        return { success: true, message: stripe ? 'Plan created' : 'Plan saved (Stripe is not configured)', price: { ...plan.toObject(), id: plan.stripePriceId ?? plan._id } };
      },
      deactivatePrice: async (_p, { input }: { input: { priceId?: string; id?: string } }, ctx) => {
        await requireAdmin(ctx, 'Configuration');
        const key = input.priceId ?? input.id;
        const plan = must(await SubscriptionPlan.findOne(isId(key) ? { $or: [{ _id: key }, { stripePriceId: key }] } : { stripePriceId: key }), 'Plan');
        plan.isActive = false;
        await plan.save();
        const stripe = await getStripe();
        if (stripe && plan.stripePriceId) await stripe.prices.update(plan.stripePriceId, { active: false }).catch(() => undefined);
        return { success: true, message: 'Plan deactivated' };
      },
      createSubscription: async (_p, { input }: { input: { stripePriceId: string; paymentMethodId: string } }, ctx) => {
        const user = await requireCustomer(ctx);
        const plan = must(await SubscriptionPlan.findOne({ stripePriceId: input.stripePriceId, isActive: true }), 'Plan');
        if (user.subscription?.status === 'active') throw conflict('You already have an active membership.');
        const { stripe, customerId } = await stripeCustomer(user);
        await stripe.paymentMethods.attach(input.paymentMethodId, { customer: customerId });
        await stripe.customers.update(customerId, { invoice_settings: { default_payment_method: input.paymentMethodId } });
        const sub = await stripe.subscriptions.create({ customer: customerId, items: [{ price: input.stripePriceId }], metadata: { userId: String(user._id) } });
        user.set('subscription', { planId: plan._id, stripeSubscriptionId: sub.id, status: sub.status === 'active' || sub.status === 'trialing' ? 'active' : sub.status, discountPercent: plan.discountPercent, currentPeriodEnd: undefined });
        user.stripe_plan_id = input.stripePriceId;
        user.freeDeliveries = (user.freeDeliveries ?? 0) + (plan.freeDeliveries ?? 0);
        await user.save();
        return { message: user.subscription?.status === 'active' ? 'Membership activated.' : `Membership status: ${sub.status}` };
      },
      updateSubscription: async (_p, { input }: { input: { newStripePriceId: string } }, ctx) => {
        const user = await requireCustomer(ctx);
        const plan = must(await SubscriptionPlan.findOne({ stripePriceId: input.newStripePriceId, isActive: true }), 'Plan');
        const subId = user.subscription?.stripeSubscriptionId;
        if (!subId) throw badInput('You do not have an active membership.');
        const { stripe } = await stripeCustomer(user);
        const sub = await stripe.subscriptions.retrieve(subId);
        await stripe.subscriptions.update(subId, { items: [{ id: sub.items.data[0]!.id, price: input.newStripePriceId }], proration_behavior: 'create_prorations' });
        user.set('subscription.planId', plan._id);
        user.set('subscription.discountPercent', plan.discountPercent);
        user.stripe_plan_id = input.newStripePriceId;
        await user.save();
        return { message: 'Membership updated.' };
      },
      cancelSubscription: async (_p, _a, ctx) => {
        const user = await requireCustomer(ctx);
        const subId = user.subscription?.stripeSubscriptionId;
        if (!subId) throw badInput('You do not have an active membership.');
        const { stripe } = await stripeCustomer(user);
        await stripe.subscriptions.cancel(subId);
        user.set('subscription.status', 'canceled');
        user.stripe_plan_id = undefined;
        await user.save();
        return { message: 'Membership cancelled.' };
      },
      checkReferralCodeExists: async (_p, { referralCode }: { referralCode: string }) =>
        Boolean(await User.exists({ referralCode: String(referralCode ?? '').trim().toUpperCase() })),
      giveFeedback: async (_p, { feedbackInput }: { feedbackInput: { rating?: number; comments?: string; message?: string; orderId?: string; category?: string } }, ctx) => {
        const user = await requireCustomer(ctx);
        const order = feedbackInput.orderId ? await Order.findOne({ user: user._id, ...(isId(feedbackInput.orderId) ? { _id: feedbackInput.orderId } : { orderId: feedbackInput.orderId }) }).select('_id').lean() : null;
        await Feedback.create({ user: user._id, order: order?._id, rating: feedbackInput.rating, message: feedbackInput.comments ?? feedbackInput.message, category: feedbackInput.category });
        return { success: true, message: 'Thank you for your feedback!' };
      },
    },
    CreditRecord: {
      userId: (r: { user?: unknown }, _a, ctx) => (r.user ? ctx.loaders.user.load(String(r.user)) : null),
    },
    AdminFood: { id: (f: { _id?: unknown; id?: unknown }) => f.id ?? f._id },
    FoodDeal: {
      id: (d: { _id?: unknown; id?: unknown }) => d.id ?? d._id,
      food: (d: { food?: unknown }) => (d.food ? String(d.food) : null),
      variation: (d: { variation?: unknown }) => (d.variation ? String(d.variation) : null),
      restaurant: (d: { restaurant?: unknown }) => (d.restaurant ? String(d.restaurant) : null),
    },
    SubscriptionPlan: { id: (p: { id?: unknown; _id?: unknown }) => p.id ?? p._id },
  },
});

const dealOut = (d: any) => ({ ...d, id: d._id });

async function assertDeal(input: { food: unknown; variation?: unknown; discountType?: string; discountValue: number; startDate?: Date; endDate?: Date }) {
  const food = must(await Food.findById(input.food).lean(), 'Product');
  if (input.variation && !food.variations.some((v) => String(v._id) === String(input.variation))) throw badInput('Variation does not belong to the product.');
  if (input.discountType !== 'FIXED' && input.discountValue > 100) throw badInput('Percentage discount cannot exceed 100.');
  if (input.startDate && input.endDate && input.startDate > input.endDate) throw badInput('Start date must be before end date.');
}

async function saveSvFood(ctx: GraphQLContext, foodId: string | null, f: z.infer<typeof SvFood>) {
  await requireRestaurantAccess(ctx, f.restaurant);
  must(await Category.exists({ _id: f.category, restaurant: f.restaurant }), 'Category');
  const data = {
    ...f,
    variations: f.variations.map((v) => ({
      ...(isId(v._id ?? v.id) ? { _id: v._id ?? v.id } : {}),
      title: v.title,
      price: v.price,
      discounted: v.discounted,
      addons: v.addons,
      isOutOfStock: v.isOutOfStock ?? false,
    })),
    isActive: f.isActive ?? true,
    isOutOfStock: f.isOutOfStock ?? false,
  };
  if (foodId) must(await Food.findOneAndUpdate({ _id: foodId, restaurant: f.restaurant }, data, { runValidators: true }), 'Product');
  else await Food.create({ ...data, order: await Food.countDocuments({ category: f.category }) });
  return must(await Restaurant.findById(f.restaurant).lean(), 'Restaurant');
}

async function categoriesWithSubs(ctx: GraphQLContext, withItems: boolean) {
  const r = await store();
  const cats = await Category.find({ restaurant: r._id, isActive: { $ne: false } }).sort({ order: 1, createdAt: 1 }).lean();
  const subs = await SubCategory.find({ parentCategoryId: { $in: cats.map((c) => String(c._id)) } }).lean();
  const favs = withItems ? await favouritesOf(ctx) : new Set<string>();
  return Promise.all(
    cats.map(async (c) => {
      const mySubs = subs.filter((s) => s.parentCategoryId === String(c._id));
      if (!withItems) return { categoryId: c._id, categoryName: c.title, subCategories: mySubs.map((s) => ({ subCategoryId: s._id, subCategoryName: s.title })) };
      const foods = await Food.find({ category: c._id, ...PUBLIC_FOOD }).sort({ order: 1 }).limit(200).lean();
      const views = await productViews(foods as never, favs);
      return {
        categoryId: c._id,
        categoryName: c.title,
        items: views.filter((v) => !v.subCategory),
        subCategories: mySubs.map((s) => ({ subCategoryId: s._id, subCategoryName: s.title, items: views.filter((v) => v.subCategory === String(s._id)) })),
      };
    }),
  );
}

void env;
