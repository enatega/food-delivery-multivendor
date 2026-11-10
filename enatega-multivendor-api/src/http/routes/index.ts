import { Router } from 'express';

/** REST endpoints used by the apps (payments, maps proxy). */
export const restRouter = Router();
/** Endpoints that must receive the raw body (webhooks). */
export const rawBodyRoutes = Router();
