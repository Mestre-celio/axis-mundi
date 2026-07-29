import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { readingController } from './controllers/readingController';
import { orderController } from './controllers/orderController';
import { dossierController } from './controllers/dossierController';
import { webhookController } from './controllers/webhookController';
import { profileController } from './controllers/profileController';
import { oracleController } from './controllers/oracleController';
import { marketplaceController } from './controllers/marketplaceController';

export const routes = Router();

// --- Rotas públicas ---
routes.get('/oracles', oracleController.list);
routes.get('/oracles/:slug', oracleController.getBySlug);
routes.post('/degustacao', oracleController.degustacao);
routes.post('/oraculo/iniciar', oracleController.iniciarChat);
routes.post('/webhooks/asaas', webhookController.handleAsaas);

// --- Marketplace público ---
routes.get('/sacerdotes', marketplaceController.listSacerdotes);
routes.get('/sacerdotes/:id', marketplaceController.getSacerdote);

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
routes.get('/dossiers/status', dossierController.status);
routes.post('/dossiers/generate', dossierController.generate);
routes.get('/dossiers/:id/download', dossierController.download);

// --- Marketplace protegido ---
routes.use('/agendamentos', requireAuth);
routes.post('/agendamentos', marketplaceController.criarAgendamento);
routes.get('/agendamentos', marketplaceController.listarAgendamentos);
routes.get('/agendamentos/dashboard-sacerdote', marketplaceController.dashboardSacerdote);
