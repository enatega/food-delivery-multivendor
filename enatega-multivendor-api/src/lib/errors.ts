import { GraphQLError } from 'graphql';

/**
 * Error codes understood by the client apps:
 * - UNAUTHENTICATED / TOKEN_EXPIRED / INVALID_TOKEN -> the apps log the user out.
 * - Public-access-token failures use the "Unauthorized: ..." message prefix WITHOUT
 *   one of the codes above, so the apps refresh the public token instead of logging out.
 */
export type ErrorCode =
  | 'UNAUTHENTICATED'
  | 'TOKEN_EXPIRED'
  | 'INVALID_TOKEN'
  | 'FORBIDDEN'
  | 'BAD_USER_INPUT'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'PUBLIC_TOKEN_INVALID'
  | 'PAYMENT_FAILED'
  | 'SERVICE_UNAVAILABLE'
  | 'INTERNAL_SERVER_ERROR';

export class AppError extends GraphQLError {
  constructor(message: string, code: ErrorCode, extensions: Record<string, unknown> = {}) {
    super(message, { extensions: { code, ...extensions } });
  }
}

export const unauthenticated = (message = 'Unauthenticated. Please log in.') => new AppError(message, 'UNAUTHENTICATED');
export const tokenExpired = () => new AppError('Your session has expired. Please log in again.', 'TOKEN_EXPIRED');
export const invalidToken = (message = 'Invalid session. Please log in again.') => new AppError(message, 'INVALID_TOKEN');
export const forbidden = (message = 'You are not allowed to perform this action.') => new AppError(message, 'FORBIDDEN');
export const badInput = (message: string, extensions: Record<string, unknown> = {}) =>
  new AppError(message, 'BAD_USER_INPUT', extensions);
export const notFound = (what = 'Resource') => new AppError(`${what} not found`, 'NOT_FOUND');
export const conflict = (message: string) => new AppError(message, 'CONFLICT');
export const rateLimited = (message = 'Too many requests. Please try again later.') => new AppError(message, 'RATE_LIMITED');
export const publicTokenInvalid = (reason: string) => new AppError(`Unauthorized: ${reason}`, 'PUBLIC_TOKEN_INVALID');

/** Throws NOT_FOUND when the value is null/undefined, otherwise returns it (narrowed). */
export function must<T>(value: T | null | undefined, what = 'Resource'): T {
  if (value === null || value === undefined) throw notFound(what);
  return value;
}
