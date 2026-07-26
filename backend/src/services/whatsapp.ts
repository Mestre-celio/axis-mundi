import axios from 'axios';
import { config } from '../config';
import { logger } from '../lib/logger';

interface SendMessageParams {
  phone: string;
  message: string;
  mediaUrl?: string;
}

export class WhatsAppService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: config.whatsapp.apiUrl,
      headers: {
        'api-key': config.whatsapp.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  async sendDossierLink(params: SendMessageParams): Promise<boolean> {
    try {
      const message = `🧿 *Axis Mundi — Seu Dossiê Está Pronto!* 🧿\n\n${params.message}\n\n🔮 *Acesse aqui:* ${params.mediaUrl}\n\n_O conhecimento é a ponte entre os mundos._ 🌌`;

      await this.api.post('/message/send', {
        number: params.phone,
        text: message,
      });

      logger.info({ phone: params.phone }, 'Mensagem WhatsApp enviada');
      return true;
    } catch (err: any) {
      logger.error({ err: err.response?.data || err.message }, 'WhatsApp send error');
      return false;
    }
  }
}
