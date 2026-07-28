'use client';

import { useEffect, useState } from 'react';
import { getDailyInsights } from '@/lib/dailyInsights';

interface DailyInsights {
  biblicalVerse: { reference: string; text: string };
  quranVerse: { reference: string; text: string };
  tarotCard: { name: string; message: string; icon: string };
  lunarPhase: { phase: string; energy: string; icon: string };
}

export function DailyDashboard() {
  const [insights, setInsights] = useState<DailyInsights | null>(null);

  useEffect(() => {
    const data = getDailyInsights();
    setInsights(data);
  }, []);

  if (!insights) {
    return (
      <div className="w-full py-8 text-center text-[#E5C158]/60 font-display text-sm">
        Sintonizando as sabedorias do dia...
      </div>
    );
  }

  const cards = [
    {
      title: '🕊️ Luz Bíblica',
      content: `"${insights.biblicalVerse.text}"`,
      footer: `— ${insights.biblicalVerse.reference}`,
    },
    {
      title: '🌙 Reflexão Sagrada',
      content: `"${insights.quranVerse.text}"`,
      footer: `— ${insights.quranVerse.reference}`,
    },
    {
      title: '🃏 Arcano Regente',
      content: (
        <>
          <h4 className="font-display text-[#E5C158] text-base mb-1">
            {insights.tarotCard.icon} {insights.tarotCard.name}
          </h4>
          <p className="text-xs text-[#D8B4F8]">{insights.tarotCard.message}</p>
        </>
      ),
    },
    {
      title: '🌕 Influência Lunar',
      content: (
        <>
          <h4 className="font-display text-[#E5C158] text-base mb-1">
            {insights.lunarPhase.icon} {insights.lunarPhase.phase}
          </h4>
          <p className="text-xs text-[#D8B4F8]">{insights.lunarPhase.energy}</p>
        </>
      ),
    },
  ];

  return (
    <section className="w-full mb-10">
      <h2 className="font-display text-lg text-[#E5C158] mb-5 tracking-wide text-center md:text-left">
        ✨ Pílulas de Sabedoria do Dia
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="p-5 rounded-xl transition-all duration-300 flex flex-col justify-between"
            style={{
              background: 'rgba(31, 11, 56, 0.6)',
              border: '1px solid rgba(229, 193, 88, 0.15)',
            }}
          >
            <div>
              <span className="text-xs uppercase font-bold tracking-wider block mb-2" style={{ color: 'rgba(229, 193, 88, 0.7)' }}>
                {card.title}
              </span>
              {typeof card.content === 'string' ? (
                <p className="text-sm text-gray-300 italic leading-relaxed">{card.content}</p>
              ) : (
                card.content
              )}
            </div>
            {card.footer && (
              <span className="text-xs font-semibold mt-3 text-right" style={{ color: '#E5C158' }}>
                {card.footer}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}