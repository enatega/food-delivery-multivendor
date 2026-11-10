import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ok, startTestServer, type TestServer } from './helpers.js';
import { Food, FoodDeal, User } from '../src/models/index.js';

let server: TestServer;
let token: string;
let foodId: string;
let variationId: string;

beforeAll(async () => {
  server = await startTestServer();
  token = (await ok(server, `mutation{ login(email:"customer@example.com", password:"Password123!", type:"default"){ token } }`)).login.token;
  const food = (await Food.findOne({ title: 'Margherita' }).lean())!;
  foodId = String(food._id);
  variationId = String(food.variations[1]!._id); // Large, 12.00
  await FoodDeal.create({ restaurant: server.ids.restaurantId, food: food._id, variation: food.variations[1]!._id, title: 'Half price', discountType: 'PERCENTAGE', discountValue: 50, section: 'weekly' });
  await User.updateOne({ email: 'customer@example.com' }, { credits: 2, addresses: [{ label: 'Home', deliveryAddress: 'Torstr. 1', location: { type: 'Point', coordinates: [13.4, 52.53] }, selected: true }] });
});
afterAll(async () => {
  await server?.close();
});

describe('single-vendor cart and checkout', () => {
  it('lists deals in discovery', async () => {
    const d = await ok(server, `{ singleVendorDiscovery { catalogVersion deals { weekly { totalCount items { id variations { id price discounted deal { discountValue } } } } } categories { name itemCount } } }`, {}, token);
    expect(d.singleVendorDiscovery.deals.weekly.totalCount).toBe(1);
    const v = d.singleVendorDiscovery.deals.weekly.items[0].variations.find((x: { id: string }) => x.id === variationId);
    expect(v.discounted).toBe(6);
  });

  it('adds to cart, updates quantity and prices with the deal', async () => {
    const added = await ok(server, `mutation($i:CartInput!){ userCartData(input:$i){ success cartRevision grandTotal actualGrandTotal totalDiscount foods { foodId variations { _id quantity unitPrice } } } }`, {
      i: { food: [{ _id: foodId, categoryId: 'x', variation: { _id: variationId, addons: [], count: 1 } }] },
    }, token);
    expect(added.userCartData.grandTotal).toBe(6);
    const lineId = added.userCartData.foods[0].variations[0]._id;
    const updated = await ok(server, `mutation($i:UpdateCartCountInput!){ updateUserCartCount(input:$i){ success quantity itemTotal grandTotal } }`, {
      i: { variation_id: lineId, foodId, variationId, action: 'increase', count: 3 },
    }, token);
    expect(updated.updateUserCartCount).toMatchObject({ success: true, quantity: 3, itemTotal: 18, grandTotal: 18 });
  });

  it('calculates checkout server-side (deal + tax + credits) and places the order from the cart', async () => {
    const c = await ok(server, `query{ calculateCheckout(isPickup:false, latDestination:52.53, longDestination:13.4){ subtotal taxAmount creditsUsed grandTotal checkoutQuoteId discountDetails { dealDiscount } } }`, {}, token);
    expect(c.calculateCheckout.subtotal).toBe(18);
    expect(c.calculateCheckout.discountDetails.dealDiscount).toBe(18);
    expect(c.calculateCheckout.creditsUsed).toBe(2);
    const placed = await ok(server, `mutation($q:String,$k:String){ placeOrder(paymentMethod:"COD", isPickedUp:false, checkoutQuoteId:$q, idempotencyKey:$k){ _id orderAmount creditsApplied: discountAmount items { quantity } } }`, { q: c.calculateCheckout.checkoutQuoteId, k: 'idem-1' }, token);
    expect(placed.placeOrder.orderAmount).toBeCloseTo(c.calculateCheckout.grandTotal, 2);
    const again = await ok(server, `mutation($k:String){ placeOrder(paymentMethod:"COD", isPickedUp:false, idempotencyKey:$k){ _id } }`, { k: 'idem-1' }, token);
    expect(again.placeOrder._id).toBe(placed.placeOrder._id);
    const cart = await ok(server, `{ getUserCart { foods { foodId } grandTotal } getAllUserCredits { credits } }`, {}, token);
    expect(cart.getUserCart.foods).toHaveLength(0);
    expect(cart.getAllUserCredits.credits).toBe(0);
    const page = await ok(server, `query($id:String!){ orderDetailsPage(orderId:$id){ success data { orderId itemsSubTotal creditsApplied items { foodTitle variationTotal } } } }`, { id: placed.placeOrder._id }, token);
    expect(page.orderDetailsPage.data.creditsApplied).toBe(2);
  });
});
