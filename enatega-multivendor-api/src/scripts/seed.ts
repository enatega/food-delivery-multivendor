/**
 * Seeds demo data for local development / staging: an admin, a vendor, a zone,
 * a restaurant with a small menu, a rider and a customer.
 * Refuses to run when NODE_ENV=production.
 */
import { env } from '../config/env.js';
import { connectMongo, disconnectMongo } from '../lib/mongo.js';
import { hashPassword } from '../auth/password.js';
import { Addon, Category, Cuisine, Food, Option, Owner, Restaurant, Rider, ShopType, User, Zone } from '../models/index.js';
import { point } from '../models/common.js';
import { ensureBootstrapData } from './bootstrap.js';

/** Creates the demo dataset (idempotent). Returns the main ids. */
export async function seedDemoData() {
  await ensureBootstrapData();
  const pwd = await hashPassword('Password123!');
  const center = { lat: 52.52, lng: 13.405 };
  const ring = [
    [center.lng - 0.2, center.lat - 0.15],
    [center.lng + 0.2, center.lat - 0.15],
    [center.lng + 0.2, center.lat + 0.15],
    [center.lng - 0.2, center.lat + 0.15],
    [center.lng - 0.2, center.lat - 0.15],
  ];
  const admin = await Owner.findOneAndUpdate({ email: 'admin@example.com' }, { $setOnInsert: { password: pwd, userType: 'ADMIN', name: 'Admin' } }, { upsert: true, returnDocument: 'after' });
  const vendor = await Owner.findOneAndUpdate({ email: 'vendor@example.com' }, { $setOnInsert: { password: pwd, userType: 'VENDOR', name: 'Demo Vendor' } }, { upsert: true, returnDocument: 'after' });
  await ShopType.findOneAndUpdate({ slug: 'restaurant' }, { $setOnInsert: { name: 'Restaurant', isActive: true } }, { upsert: true });
  await Cuisine.findOneAndUpdate({ name: 'Pizza' }, { $setOnInsert: { shopType: 'restaurant' } }, { upsert: true });
  const zone = await Zone.findOneAndUpdate({ title: 'Demo Zone' }, { $setOnInsert: { location: { type: 'Polygon', coordinates: [ring] }, isActive: true } }, { upsert: true, returnDocument: 'after' });
  let restaurant = await Restaurant.findOne({ username: 'demo-store' });
  if (!restaurant) {
    restaurant = await Restaurant.create({
      name: 'Demo Pizzeria',
      slug: 'demo-pizzeria',
      username: 'demo-store',
      password: pwd,
      owner: vendor!._id,
      orderPrefix: 'DEM',
      address: 'Alexanderplatz 1, Berlin',
      location: point(center.lng, center.lat),
      deliveryBounds: { type: 'Polygon', coordinates: [ring] },
      zone: zone!._id,
      cuisines: ['Pizza'],
      minimumOrder: 5,
      tax: 7,
      deliveryTime: 25,
      commissionRate: 10,
    });
    const option = await Option.create({ restaurant: restaurant._id, title: 'Extra cheese', price: 1.5 });
    const addon = await Addon.create({ restaurant: restaurant._id, title: 'Toppings', options: [String(option._id)], quantityMinimum: 0, quantityMaximum: 3 });
    const category = await Category.create({ restaurant: restaurant._id, title: 'Pizzas' });
    await Food.create({
      restaurant: restaurant._id,
      category: category._id,
      title: 'Margherita',
      description: 'Tomato, mozzarella, basil',
      variations: [
        { title: 'Small', price: 8, addons: [String(addon._id)] },
        { title: 'Large', price: 12, addons: [String(addon._id)] },
      ],
    });
  }
  await Rider.findOneAndUpdate({ username: 'demo-rider' }, { $setOnInsert: { name: 'Demo Rider', password: pwd, zone: zone!._id, phone: '+491700000000' } }, { upsert: true });
  await User.findOneAndUpdate(
    { email: 'customer@example.com' },
    { $setOnInsert: { name: 'Demo Customer', password: pwd, phone: '+491700000001', emailIsVerified: true, phoneIsVerified: true, referralCode: 'DEMO1234' } },
    { upsert: true },
  );
  return { adminId: admin!._id, vendorId: vendor!._id, zoneId: zone!._id, restaurantId: restaurant._id };
}

async function main() {
  if (env.NODE_ENV === 'production') throw new Error('Refusing to seed a production database.');
  await connectMongo();
  await seedDemoData();
  console.log('Seed complete. Accounts (password: Password123!):');
  console.log('  admin@example.com (dashboard), vendor@example.com (dashboard), demo-store (store app), demo-rider (rider app), customer@example.com (customer)');
  await disconnectMongo();
}

if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  main().catch(async (err) => {
    console.error(err);
    await disconnectMongo();
    process.exit(1);
  });
}
