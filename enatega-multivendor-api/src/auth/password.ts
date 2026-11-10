import bcrypt from 'bcryptjs';
import { badInput } from '../lib/errors.js';

const ROUNDS = 12;

export const hashPassword = (plain: string): Promise<string> => bcrypt.hash(plain, ROUNDS);

export async function verifyPassword(plain: string, hash: string | null | undefined): Promise<boolean> {
  if (!hash) {
    // Equalize timing for unknown accounts.
    await bcrypt.compare(plain, '$2a$12$C6UzMDM.H6dfI/f/IKcEeO6yHyNBMn4i0lJ/3TQQ3TQVq3Ckxq7lm');
    return false;
  }
  return bcrypt.compare(plain, hash);
}

/** Customer apps accept 6+ characters; dashboard accounts require 8+. */
export function assertStrongPassword(password: string, minLength = 6): void {
  if (typeof password !== 'string' || password.length < minLength) {
    throw badInput(`Password must be at least ${minLength} characters long.`);
  }
  if (password.length > 128) throw badInput('Password is too long.');
}
