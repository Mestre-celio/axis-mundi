import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { readingController } from './controllers/readingController';
import { orderController } from './controllers/orderController';
import { dossierController } from './controllers/dossierController';
import { webhookController } from './controllers/webhookController';
import { profileController } from './controllers/profileController';
import { oracleController } from './controllers/oracleController';

export const routes = Router();

// --- Rotas públicas ---
routes.get('/oracles', oracleController.list);
routes.get('/oracles/:slug', oracleController.getBySlug);
routes.post('/webhooks/asaas', webhookController.handleAsaas);

// --- Rotas protegidas ---
routes.use('/profile', requireAuth);
routes.get('/profile', profileController.get);
routes.put('/profile', profileController.update);

routes.use('/readings', requireAuth);
routes.post('/readings', readingController.create);
routes.get('/readings', readingController.list);
routes.get('/readings/:id', readingController.getById);

routes.use('/orders', requireAuth);
routes.post('/orders', orderController.create);
routes.get('/orders', orderController.list);
routes.get('/orders/:id', orderController.getById);

routes.use('/dossiers', requireAuth);
routes.post('/dossiers/generate', dossierController.generate);
routes.get('/dossiers/:id/download', dossierController.download);
