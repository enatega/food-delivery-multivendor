import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { hashPassword } from '../auth/password.js';
import { Owner, Taxation, Tipping } from '../models/index.js';
import { getConfig } from '../services/config.js';

/** Idempotent first-boot setup: configuration singleton, defaults and the initial super admin. */
export async function ensureBootstrapData(): Promise<void> {
  await getConfig();
  if (!(await Tipping.exists({}))) await Tipping.create({ tipVariations: [5, 10, 15], enabled: true });
  if (!(await Taxation.exists({}))) await Taxation.create({ taxationCharges: 0, enabled: false });
  if (!(await Owner.exists({ userType: 'ADMIN', isDeleted: { $ne: true } }))) {
    if (env.ADMIN_EMAIL && env.ADMIN_PASSWORD) {
      await Owner.create({ email: env.ADMIN_EMAIL.toLowerCase(), password: await hashPassword(env.ADMIN_PASSWORD), name: 'Administrator', userType: 'ADMIN' });
      logger.info({ email: env.ADMIN_EMAIL }, 'Created initial super admin from ADMIN_EMAIL / ADMIN_PASSWORD');
    } else {
      logger.warn('No super admin exists. Set ADMIN_EMAIL and ADMIN_PASSWORD or run `npm run create-admin`.');
    }
  }
}
