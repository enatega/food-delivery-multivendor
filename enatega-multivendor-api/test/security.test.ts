import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import jwt from 'jsonwebtoken';
import { gql, ok, startTestServer, type TestServer } from './helpers.js';

let server: TestServer;
let adminToken: string;
let customerToken: string;

beforeAll(async () => {
  server = await startTestServer();
  adminToken = (await ok(server, `mutation{ ownerLogin(email:"admin@example.com", password:"Password123!"){ token } }`)).ownerLogin.token;
  customerToken = (await ok(server, `mutation{ login(email:"customer@example.com", password:"Password123!", type:"default"){ token } }`)).login.token;
});
afterAll(async () => {
  await server?.close();
});

describe('authentication', () => {
  it('maps token problems to the codes the apps understand', async () => {
    const bad = await gql(server, `{ profile { _id } }`, {}, 'not-a-jwt');
    expect(bad.errors?.[0]?.extensions?.code).toBe('INVALID_TOKEN');
    const expired = jwt.sign({ sub: 'x', typ: 'customer', tv: 0 }, process.env.JWT_SECRET!, { expiresIn: -10, issuer: 'enatega-api', audience: 'access' });
    const r = await gql(server, `{ profile { _id } }`, {}, expired);
    expect(r.errors?.[0]?.extensions?.code).toBe('TOKEN_EXPIRED');
    const none = await gql(server, `{ profile { _id } }`);
    expect(none.errors?.[0]?.extensions?.code).toBe('UNAUTHENTICATED');
  });

  it('serves public data even when a stale token is attached', async () => {
    const r = await gql(server, `{ zones { _id title } cuisines { name } }`, {}, 'stale-token');
    expect(r.errors).toBeUndefined();
    expect(r.data.zones.length).toBeGreaterThan(0);
  });

  it('revokes sessions when an admin resets them', async () => {
    const me = await ok(server, `{ profile { _id } }`, {}, customerToken);
    await ok(server, `mutation($id:ID!){ resetUserSession(userId:$id){ _id } }`, { id: me.profile._id }, adminToken);
    const r = await gql(server, `{ profile { _id } }`, {}, customerToken);
    expect(r.errors?.[0]?.extensions?.code).toBe('INVALID_TOKEN');
  });

  it('issues, refreshes and revokes dashboard tokens', async () => {
    const login = await ok(server, `mutation{ ownerLogin(email:"vendor@example.com", password:"Password123!"){ token refreshToken userType restaurants { _id } } }`);
    expect(login.ownerLogin.userType).toBe('VENDOR');
    expect(login.ownerLogin.restaurants).toHaveLength(1);
    const refreshed = await ok(server, `mutation($t:String!){ refreshToken(refreshToken:$t, userType:"VENDOR"){ token refreshToken } }`, { t: login.ownerLogin.refreshToken });
    expect(refreshed.refreshToken.token).toBeTruthy();
    const session = await ok(server, `{ ownerSession { userType token restaurants { _id } } }`, {}, refreshed.refreshToken.token);
    expect(session.ownerSession.token).toBe(refreshed.refreshToken.token);
    await ok(server, `mutation{ ownerLogout }`, {}, refreshed.refreshToken.token);
    const again = await gql(server, `mutation($t:String!){ refreshToken(refreshToken:$t, userType:"VENDOR"){ token } }`, { t: login.ownerLogin.refreshToken });
    expect(again.errors?.[0]?.extensions?.code).toBe('INVALID_TOKEN');
  });

  it('issues a nonce-bound public access token', async () => {
    const r = await gql(server, `mutation MetricsGeneral { metricsGeneral { experience hehe excellence } }`, {}, undefined, { nonce: 'n'.repeat(32) });
    expect(r.data.metricsGeneral.experience.split('.')).toHaveLength(3);
    expect(new Date(r.data.metricsGeneral.hehe).getTime()).toBeGreaterThan(Date.now());
    const missing = await gql(server, `mutation { metricsGeneral { experience } }`);
    expect(missing.errors?.[0]?.message).toMatch(/^Unauthorized:/);
  });
});

describe('authorization', () => {
  it('keeps admin-only operations away from customers and vendors', async () => {
    const asCustomer = await gql(server, `{ users { _id } }`, {}, customerToken);
    expect(asCustomer.errors?.[0]?.extensions?.code).toMatch(/FORBIDDEN|INVALID_TOKEN/);
    const vendor = (await ok(server, `mutation{ ownerLogin(email:"vendor@example.com", password:"Password123!"){ token } }`)).ownerLogin.token;
    const r = await gql(server, `{ usersPaginated { totalCount } }`, {}, vendor);
    expect(r.errors?.[0]?.extensions?.code).toBe('FORBIDDEN');
  });

  it('scopes vendors to their own stores', async () => {
    const other = await ok(server, `mutation{ createVendor(vendorInput:{email:"other@example.com", password:"Password123!", name:"Other"}){ _id } }`, {}, adminToken);
    expect(other.createVendor._id).toBeTruthy();
    const otherToken = (await ok(server, `mutation{ ownerLogin(email:"other@example.com", password:"Password123!"){ token } }`)).ownerLogin.token;
    const r = await gql(server, `query($id:String!){ ordersByRestId(restaurant:$id){ totalCount } }`, { id: String(server.ids.restaurantId) }, otherToken);
    expect(r.errors?.[0]?.extensions?.code).toBe('FORBIDDEN');
    const list = await ok(server, `{ restaurants { _id } }`, {}, otherToken);
    expect(list.restaurants).toHaveLength(0);
  });

  it('stores third-party secrets encrypted and never returns them', async () => {
    await ok(server, `mutation($c:StripeConfigurationInput!){ saveStripeConfiguration(configurationInput:$c){ _id publishableKey } }`, { c: { publishableKey: 'pk_test_123', secretKey: 'sk_test_secret' } }, adminToken);
    const admin = await ok(server, `{ adminConfiguration { publishableKey hasStripeSecretConfigured } }`, {}, adminToken);
    expect(admin.adminConfiguration).toEqual({ publishableKey: 'pk_test_123', hasStripeSecretConfigured: true });
    const pub = await ok(server, `{ configuration { publishableKey twilioAccountSid email } }`);
    expect(pub.configuration.publishableKey).toBe('pk_test_123');
    expect(pub.configuration.email).toBeNull();
    const { Configuration } = await import('../src/models/index.js');
    const raw = await Configuration.findOne().lean();
    expect(raw!.secretKey).toMatch(/^enc:v1:/);
  });
});

describe('input hardening', () => {
  it('validates input scalars with field-level details', async () => {
    const r = await gql(server, `mutation($a:AddressInput!){ createAddress(addressInput:$a){ _id } }`, { a: { deliveryAddress: 'x', latitude: 'abc', longitude: 10 } }, (await ok(server, `mutation{ login(email:"customer@example.com", password:"Password123!", type:"default"){ token } }`)).login.token);
    expect(r.errors?.[0]?.extensions?.code).toBe('BAD_USER_INPUT');
    expect(r.errors?.[0]?.message).toMatch(/AddressInput/);
  });

  it('rejects overly deep queries', async () => {
    const deep = `{ restaurant(id:"${String(server.ids.restaurantId)}") { reviewData { reviews { order { restaurant { reviewData { reviews { order { restaurant { reviewData { reviews { order { restaurant { reviewData { reviews { _id } } } } } } } } } } } } } } } }`;
    const r = await gql(server, deep);
    expect(r.errors?.[0]?.message).toMatch(/depth/i);
  });

  it('blocks CSRF-able requests', async () => {
    const res = await fetch(`${server.url}/graphql?query=${encodeURIComponent('{ _health }')}`);
    expect(res.status).toBe(400);
  });

  it('exposes health and metrics endpoints', async () => {
    expect((await fetch(`${server.url}/health/live`)).status).toBe(200);
    const ready = (await (await fetch(`${server.url}/health/ready`)).json()) as { mongo: boolean };
    expect(ready.mongo).toBe(true);
    const metrics = await (await fetch(`${server.url}/metrics`)).text();
    expect(metrics).toContain('enatega_graphql_operations_total');
  });
});

describe('privacy', () => {
  it('shows only the reviewer first name on public reviews', async () => {
    const { Order, Review, User, Restaurant } = await import('../src/models/index.js');
    const user = (await User.findOne({ email: 'customer@example.com' }))!;
    user.name = 'Demo Customer';
    await user.save();
    const order = await Order.create({
      orderId: 'PRIV-1',
      restaurant: server.ids.restaurantId,
      user: user._id,
      items: [{ title: 'Margherita', quantity: 1 }],
      paymentMethod: 'COD',
      orderAmount: 10,
      orderStatus: 'DELIVERED',
      deliveryAddress: { deliveryAddress: 'Secret street 1' },
    });
    await Review.create({ order: order._id, restaurant: server.ids.restaurantId, user: user._id, rating: 4 });
    await Restaurant.updateOne({ _id: server.ids.restaurantId }, { reviewCount: 1, reviewAverage: 4 });
    const r = await ok(server, `query($id:String!){ reviewsByRestaurant(restaurant:$id){ reviews { rating order { orderId deliveryAddress { deliveryAddress } items { title } user { name email phone } } } } }`, { id: String(server.ids.restaurantId) });
    const o = r.reviewsByRestaurant.reviews[0].order;
    expect(o.user).toEqual({ name: 'Demo', email: null, phone: null });
    expect(o.deliveryAddress).toBeNull();
    expect(o.items[0].title).toBe('Margherita');
  });
});
