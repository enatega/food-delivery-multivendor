/**
 * Creates (or resets the password of) a super admin.
 * Usage: npm run create-admin -- admin@example.com 'StrongPassword123'
 */
import { connectMongo, disconnectMongo } from '../lib/mongo.js';
import { assertStrongPassword, hashPassword } from '../auth/password.js';
import { Owner } from '../models/index.js';

async function main() {
  const [email, password] = process.argv.slice(2);
  if (!email || !password) {
    console.error('Usage: npm run create-admin -- <email> <password>');
    process.exit(1);
  }
  assertStrongPassword(password, 10);
  await connectMongo();
  const hash = await hashPassword(password);
  const existing = await Owner.findOne({ email: email.toLowerCase() });
  if (existing) {
    existing.set({ password: hash, userType: 'ADMIN', isActive: true, isDeleted: false, tokenVersion: (existing.tokenVersion ?? 0) + 1 });
    await existing.save();
    console.log(`Updated admin ${email}`);
  } else {
    await Owner.create({ email: email.toLowerCase(), password: hash, userType: 'ADMIN', name: 'Administrator' });
    console.log(`Created admin ${email}`);
  }
  await disconnectMongo();
}

main().catch(async (err) => {
  console.error(err);
  await disconnectMongo();
  process.exit(1);
});
