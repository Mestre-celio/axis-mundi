import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { logger } from './lib/logger';
import { errorHandler } from './middleware/errorHandler';
import { routes } from './api/routes';

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

const app = express();

app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Muitas requisições. Aguarde um momento.' } },
}));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'axis-mundi-backend', version: '1.0.0' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'axis-mundi-backend', timestamp: new Date().toISOString() });
});

app.use('/api/v1', routes);

app.use(errorHandler);

const PORT = config.port;
const HOST = '0.0.0.0';

try {
  app.listen(PORT, HOST, () => {
    console.log(`Axis Mundi API rodando em http://${HOST}:${PORT}`);
    console.log(`Ambiente: ${config.nodeEnv}`);
    logger.info(`Servidor iniciado na porta ${PORT}`);
  });
} catch (err) {
  console.error('Falha ao iniciar servidor:', err);
  process.exit(1);
}

export default app;
