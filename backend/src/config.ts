import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    storageBucket: process.env.STORAGE_BUCKET || 'portal-axium-docs',
  },

  asaas: {
    apiKey: process.env.ASAAS_API_KEY || '',
    env: process.env.ASAAS_ENV || 'sandbox',
    webhookToken: process.env.ASAAS_WEBHOOK_TOKEN || '',
    get baseUrl() {
      return this.env === 'production'
        ? 'https://api.asaas.com/v3'
        : 'https://sandbox.asaas.com/api/v3';
    },
  },

  ai: {
    provider: process.env.AI_PROVIDER || 'openai',   // 'openai' | 'groq'
    apiKey: process.env.AI_API_KEY || '',
    model: process.env.AI_MODEL || 'gpt-4o',
    get baseUrl() {
      return this.provider === 'groq'
        ? 'https://api.groq.com/openai/v1'
        : 'https://api.openai.com/v1';
    },
  },

  ephemeris: {
    path: process.env.EPHE_PATH || './data/ephe',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  whatsapp: {
    apiUrl: process.env.WHATSAPP_API_URL || 'http://localhost:8080',
    apiKey: process.env.WHATSAPP_API_KEY || '',
    instancePhone: process.env.WHATSAPP_INSTANCE_PHONE || '',
  },
} as const;
