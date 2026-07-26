import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function getOracleIcon(slug: string): string {
  const icons: Record<string, string> = {
    tarot: '🔮',
    ifa: '🌴',
    runas: 'ᚱ',
    iching: '☯',
    orixas: '🌊',
  };
  return icons[slug] || '🔮';
}

export const ORACLE_NAMES: Record<string, string> = {
  tarot: 'Tarot',
  ifa: 'Ifá',
  runas: 'Runas',
  iching: 'I Ching',
  orixas: 'Orixás',
};
