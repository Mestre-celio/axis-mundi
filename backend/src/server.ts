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

const REQUIRED_ENV_VARS = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'JWT_SECRET'] as const;
const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`ERRO CRÍTICO: Variáveis de ambiente obrigatórias não configuradas: ${missing.join(', ')}`);
  if (config.nodeEnv === 'production') process.exit(1);
  console.warn('AVISO: Rodando em desenvolvimento sem variáveis críticas — alguns recursos podem falhar.');
}

if (config.nodeEnv === 'production' && config.jwt.secret === 'dev-secret-change-in-production') {
  console.error('ERRO CRÍTICO: JWT_SECRET não foi alterado do valor padrão em produção!');
  process.exit(1);
}

const app = express();

app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Muitas requisições. Aguarde um momento.' } },
});

app.use('/api/v1', (req, res, next) => {
  if (req.path.startsWith('/webhooks/')) return next();
  return limiter(req, res, next);
});

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
