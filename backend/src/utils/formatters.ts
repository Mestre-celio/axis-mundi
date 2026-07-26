export function formatCurrency(value: number, locale = 'pt-BR', currency = 'BRL'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

export function formatDate(date: string | Date, locale = 'pt-BR'): string {
  return new Date(date).toLocaleDateString(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatZodiacDate(day: number, month: number): string {
  const dates: Record<string, [number, number, number, number]> = {
    aquario: [20, 1, 18, 2],
    peixes: [19, 2, 20, 3],
    aries: [21, 3, 19, 4],
    touro: [20, 4, 20, 5],
    gemeos: [21, 5, 21, 6],
    cancer: [22, 6, 22, 7],
    leao: [23, 7, 22, 8],
    virgem: [23, 8, 22, 9],
    libra: [23, 9, 22, 10],
    escorpiao: [23, 10, 21, 11],
    sagitario: [22, 11, 21, 12],
    capricornio: [22, 12, 19, 1],
  };

  for (const [sign, [sDay, sMonth, eDay, eMonth]] of Object.entries(dates)) {
    if ((month === sMonth && day >= sDay) || (month === eMonth && day <= eDay)) {
      return sign.charAt(0).toUpperCase() + sign.slice(1);
    }
  }
  return 'Desconhecido';
}
