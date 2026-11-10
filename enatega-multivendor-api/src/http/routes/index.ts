import { Router } from 'express';
import { mapsRouter } from './maps.js';
import { paymentsRouter, webhookRouter } from './payments.js';

/** REST endpoints used by the apps (payments, maps proxy). */
export const restRouter = Router();
restRouter.use(paymentsRouter);
restRouter.use(mapsRouter);

/** Endpoints that must receive the raw body (webhooks). */
export const rawBodyRoutes = Router();
rawBodyRoutes.use(webhookRouter);
