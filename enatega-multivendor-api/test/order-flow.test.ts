import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { gql, legacySubscribe, ok, startTestServer, type TestServer } from './helpers.js';
import { Earning, Food, Restaurant, Rider } from '../src/models/index.js';

let server: TestServer;
let customerToken: string;
let customerId: string;
let storeToken: string;
let riderToken: string;
let orderId: string;

const PLACE_ORDER = `mutation PlaceOrder($restaurant: String!, $orderInput: [OrderInput!]!, $paymentMethod: String!, $couponCode: String, $tipping: Float!, $taxationAmount: Float!, $address: AddressInput!, $orderDate: String!, $isPickedUp: Boolean!, $deliveryCharges: Float!) {
  placeOrder(restaurant: $restaurant, orderInput: $orderInput, paymentMethod: $paymentMethod, couponCode: $couponCode, tipping: $tipping, taxationAmount: $taxationAmount, address: $address, orderDate: $orderDate, isPickedUp: $isPickedUp, deliveryCharges: $deliveryCharges) {
    _id orderId orderStatus paymentStatus orderAmount deliveryCharges taxationAmount tipping createdAt
    items { _id title quantity variation { _id title price } addons { _id title options { _id title price } } }
    restaurant { _id name } user { _id name } eta { phase readyAt estimatedArrivalAt }
  }
}`;

beforeAll(async () => {
  server = await startTestServer();
});
afterAll(async () => {
  await server?.close();
});

describe('customer → store → rider order lifecycle', () => {
  it('registers and logs in a customer', async () => {
    const created = await ok(server, `mutation CreateUser($email:String,$password:String,$name:String,$phone:String){ createUser(userInput:{email:$email,password:$password,name:$name,phone:$phone}){ userId token name email isNewUser } }`, {
      email: 'jane@example.com',
      password: 'secret123',
      name: 'Jane',
      phone: '+491701234567',
    });
    expect(created.createUser.isNewUser).toBe(true);
    const login = await ok(server, `mutation Login($email:String,$password:String,$type:String!){ login(email:$email,password:$password,type:$type){ userId token tokenExpiration } }`, {
      email: 'jane@example.com',
      password: 'secret123',
      type: 'default',
    });
    customerToken = login.login.token;
    customerId = login.login.userId;
    const exists = await ok(server, `mutation($email:String!){ emailExist(email:$email){ _id } }`, { email: 'jane@example.com' });
    expect(exists.emailExist._id).toBe(customerId);
    const missing = await ok(server, `mutation($email:String!){ emailExist(email:$email){ _id } }`, { email: 'nobody@example.com' });
    expect(missing.emailExist).toBeNull();
  });

  it('rejects wrong passwords without leaking which part was wrong', async () => {
    const r = await gql(server, `mutation { login(email:"jane@example.com", password:"nope", type:"default"){ token } }`);
    expect(r.errors?.[0]?.extensions?.code).toBe('BAD_USER_INPUT');
    expect(r.errors?.[0]?.message).toBe('Invalid email or password.');
  });

  it('discovers the store by location', async () => {
    const d = await ok(server, `query($lat:Float,$lng:Float){ nearByRestaurantsPreview(latitude:$lat, longitude:$lng){ restaurants { _id name isAvailable distanceWithCurrentLocation location { coordinates } } } }`, { lat: 52.52, lng: 13.41 });
    expect(d.nearByRestaurantsPreview.restaurants.map((r: { _id: string }) => r._id)).toContain(String(server.ids.restaurantId));
    const far = await ok(server, `query{ nearByRestaurantsPreview(latitude: 40.7, longitude: -74.0){ restaurants { _id } } }`);
    expect(far.nearByRestaurantsPreview.restaurants).toHaveLength(0);
    const menu = await ok(server, `query($id:String){ restaurant(id:$id){ _id name username categories { title foods { _id title variations { _id title price addons } } } addons { _id options } options { _id price } } }`, { id: String(server.ids.restaurantId) });
    expect(menu.restaurant.categories[0].foods[0].title).toBe('Margherita');
    expect(menu.restaurant.username).toBeNull(); // dashboard-only field hidden from customers
  });

  it('places a COD order with server-side pricing and notifies the store in real time', async () => {
    const store = await ok(server, `mutation{ restaurantLogin(username:"demo-store", password:"Password123!"){ token restaurantId } }`);
    storeToken = store.restaurantLogin.token;
    const sub = await legacySubscribe(server, `subscription($r:String!){ subscribePlaceOrder(restaurant:$r){ origin order { _id orderId orderStatus } } }`, { r: String(server.ids.restaurantId) }, storeToken);

    const food = (await Food.findOne({ title: 'Margherita' }).lean())!;
    const large = food.variations.find((v) => v.title === 'Large')!;
    const addonId = large.addons[0]!;
    const { Addon } = await import('../src/models/index.js');
    const addon = (await Addon.findById(addonId).lean())!;
    const res = await ok(server, PLACE_ORDER, {
      restaurant: String(server.ids.restaurantId),
      orderInput: [{ food: String(food._id), variation: String(large._id), quantity: 2, addons: [{ _id: addonId, options: [addon.options[0]] }] }],
      paymentMethod: 'COD',
      tipping: 2,
      taxationAmount: 999, // ignored: the server computes tax
      address: { label: 'Home', deliveryAddress: 'Torstr. 1', details: '2nd floor', latitude: '52.53', longitude: '13.40' },
      orderDate: new Date().toISOString(),
      isPickedUp: false,
      deliveryCharges: 0, // ignored
    }, customerToken);
    const o = res.placeOrder;
    orderId = o._id;
    expect(o.orderStatus).toBe('PENDING');
    // (12 + 1.5) * 2 = 27; delivery = ceil(km)*rate with default rate 0 -> 0; tax 7% of 27 = 1.89; tip 2
    expect(o.taxationAmount).toBeCloseTo(1.89, 2);
    expect(o.orderAmount).toBeCloseTo(27 + 1.89 + 2 + o.deliveryCharges, 2);
    expect(o.items[0].addons[0].options[0].price).toBe(1.5);
    expect(o.orderId).toMatch(/^DEM-\d{5}$/);

    const evt = await sub.next();
    expect(evt.data.subscribePlaceOrder.origin).toBe('new');
    expect(evt.data.subscribePlaceOrder.order._id).toBe(orderId);
    sub.close();
  });

  it('does not let another customer read the order', async () => {
    const other = await ok(server, `mutation{ createUser(userInput:{email:"eve@example.com",password:"secret123",name:"Eve"}){ token } }`);
    const r = await gql(server, `query($id:String!){ order(id:$id){ _id } }`, { id: orderId }, other.createUser.token);
    expect(r.errors?.[0]?.extensions?.code).toBe('FORBIDDEN');
  });

  it('store accepts, rider self-assigns, picks up and delivers', async () => {
    const customerSub = await legacySubscribe(server, `subscription($u:String!){ orderStatusChanged(userId:$u){ origin order { _id orderStatus } } }`, { u: customerId }, customerToken);
    const accepted = await ok(server, `mutation($id:String!){ acceptOrder(_id:$id, time:"15"){ _id orderStatus preparationTime eta { phase readyAt } } }`, { id: orderId }, storeToken);
    expect(accepted.acceptOrder.orderStatus).toBe('ACCEPTED');
    expect((await customerSub.next()).data.orderStatusChanged.order.orderStatus).toBe('ACCEPTED');

    const rider = await ok(server, `mutation{ riderLogin(username:"demo-rider", password:"Password123!", timeZone:"Europe/Berlin"){ token userId } }`);
    riderToken = rider.riderLogin.token;
    const list = await ok(server, `query{ riderOrders { _id orderStatus rider { _id } } }`, {}, riderToken);
    expect(list.riderOrders.map((o: { _id: string }) => o._id)).toContain(orderId);

    const assigned = await ok(server, `mutation($id:String!){ assignOrder(id:$id){ _id orderStatus rider { _id name } } }`, { id: orderId }, riderToken);
    expect(assigned.assignOrder.orderStatus).toBe('ASSIGNED');
    const again = await gql(server, `mutation($id:String!){ assignOrder(id:$id){ _id } }`, { id: orderId }, riderToken);
    expect(again.errors?.[0]?.extensions?.code).toBe('CONFLICT');

    await ok(server, `mutation{ updateRiderLocation(latitude:"52.525", longitude:"13.402"){ _id } }`, {}, riderToken);
    const tracking = await ok(server, `query($id:ID!){ orderTracking(id:$id){ status riderLocation { latitude longitude } eta { phase source } } }`, { id: orderId }, customerToken);
    expect(tracking.orderTracking.riderLocation.latitude).toBeCloseTo(52.525);

    await ok(server, `mutation($id:String!){ updateOrderStatusRider(id:$id, status:"PICKED"){ orderStatus } }`, { id: orderId }, riderToken);
    const delivered = await ok(server, `mutation($id:String!){ updateOrderStatusRider(id:$id, status:"DELIVERED"){ orderStatus paymentStatus deliveredAt } }`, { id: orderId }, riderToken);
    expect(delivered.updateOrderStatusRider.orderStatus).toBe('DELIVERED');
    expect(delivered.updateOrderStatusRider.paymentStatus).toBe('PAID');
    customerSub.close();
  });

  it('settles earnings exactly once and credits wallets', async () => {
    const earnings = await Earning.find({ order: orderId }).lean();
    expect(earnings).toHaveLength(1);
    const e = earnings[0]!;
    expect(e.storeEarnings.orderAmount).toBeCloseTo(27, 2);
    expect(e.platformEarnings.marketplaceCommission).toBeCloseTo(2.7, 2); // 10% commission
    const store = (await Restaurant.findById(server.ids.restaurantId).lean())!;
    expect(store.currentWalletAmount).toBeCloseTo(24.3, 2);
    const rider = (await Rider.findOne({ username: 'demo-rider' }).lean())!;
    expect(rider.currentWalletAmount).toBeGreaterThanOrEqual(2); // delivery fee + tip

    const graph = await ok(server, `query($id:ID!){ storeEarningsGraph(storeId:$id){ totalCount earnings { date totalEarningsSum totalDeliveries } } }`, { id: String(server.ids.restaurantId) }, storeToken);
    expect(graph.storeEarningsGraph.earnings[0].totalEarningsSum).toBeCloseTo(24.3, 2);
  });

  it('lets the customer review a delivered order once', async () => {
    const r = await ok(server, `mutation($o:String!){ reviewOrder(reviewInput:{order:$o, rating:5, description:"Great"}){ _id review { rating } restaurant { reviewCount reviewAverage } } }`, { o: orderId }, customerToken);
    expect(r.reviewOrder.review.rating).toBe(5);
    expect(r.reviewOrder.restaurant.reviewAverage).toBe(5);
    const again = await gql(server, `mutation($o:String!){ reviewOrder(reviewInput:{order:$o, rating:1}){ _id } }`, { o: orderId }, customerToken);
    expect(again.errors?.[0]?.extensions?.code).toBe('CONFLICT');
  });

  it('handles store withdrawals against the wallet balance', async () => {
    const tooMuch = await gql(server, `mutation{ createWithdrawRequest(requestAmount: 1000){ _id } }`, {}, storeToken);
    expect(tooMuch.errors?.[0]?.extensions?.code).toBe('BAD_USER_INPUT');
    const req = await ok(server, `mutation{ createWithdrawRequest(requestAmount: 20){ _id requestId status } }`, {}, storeToken);
    expect(req.createWithdrawRequest.status).toBe('REQUESTED');
    const admin = await ok(server, `mutation{ ownerLogin(email:"admin@example.com", password:"Password123!"){ token userType } }`);
    const done = await ok(server, `mutation($id:ID!){ updateWithdrawReqStatus(id:$id, status:"TRANSFERRED"){ success data { status } } }`, { id: req.createWithdrawRequest._id }, admin.ownerLogin.token);
    expect(done.updateWithdrawReqStatus.data.status).toBe('TRANSFERRED');
    const store = (await Restaurant.findById(server.ids.restaurantId).lean())!;
    expect(store.currentWalletAmount).toBeCloseTo(4.3, 2);
    expect(store.withdrawnWalletAmount).toBeCloseTo(20, 2);
  });
});
