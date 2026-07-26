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

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'axis-mundi-backend', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`Axis Mundi API rodando na porta ${config.port}`);
});

export default app;
