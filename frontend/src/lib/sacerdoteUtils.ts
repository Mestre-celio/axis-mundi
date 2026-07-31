export const TRADICAO_LABELS: Record<string, string> = {
  candomble: 'Candomblé',
  ketu: 'Ketu',
  ifa: 'Ifá',
  amorc: 'AMORC',
  estoicismo: 'Estoicismo',
  hermetismo: 'Hermetismo',
  jung: 'Junguiano',
  wicca: 'Wicca',
  celta: 'Tradições Celtas',
  nordica: 'Tradições Nórdicas',
};

export function rotuloTradicao(chave: string | null | undefined): string {
  if (!chave) return '';
  return TRADICAO_LABELS[chave] || chave;
}

export function estrelas(nota: number | null | undefined): string {
  const n = Math.max(0, Math.min(5, Math.round(nota || 0)));
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}
