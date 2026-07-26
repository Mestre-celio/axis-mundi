import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { logger } from './lib/logger';
import { errorHandler } from './middleware/errorHandler';
import { routes } from './api/routes';

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

app.use('/api/v1', routes);

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'axis-mundi-backend', version: '1.0.0' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'axis-mundi-backend', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = config.port;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  logger.info(`Axis Mundi API rodando em http://${HOST}:${PORT}`);
  logger.info(`Ambiente: ${config.nodeEnv}`);
});

export default app;
