import crypto from 'crypto';
import { config } from '../config';

export function generateOrderSignature(orderId: string, userId: string): string {
  const payload = `${orderId}:${userId}:${config.jwt.secret}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

export function verifyOrderSignature(signature: string, orderId: string, userId: string): boolean {
  const expected = generateOrderSignature(orderId, userId);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  return `${name[0]}***${name[name.length - 1]}@${domain}`;
}
