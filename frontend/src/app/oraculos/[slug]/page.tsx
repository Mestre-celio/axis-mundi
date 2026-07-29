'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import OracleRenderer from '@/components/oracles/OracleRenderer';

const VALID_ORACLES = ['tarot', 'ifa', 'runas', 'iching', 'orixas'];

const ORACLE_INFO: Record<string, { nome: string; icone: string; desc: string }> = {
  tarot: { nome: 'Tarot', icone: '\uD83C\uDCC3', desc: 'Espelho da alma e arquétipos universais revelados através dos Arcanos.' },
  ifa: { nome: 'Ifá', icone: '\uD83E\uDE99', desc: 'Sabedoria ancestral dos Odus e o destino revelado pela matriz africana.' },
  runas: { nome: 'Runas', icone: '\u16B1', desc: 'Forças elementais e proteção dos antigos através dos símbolos nórdicos.' },
  iching: { nome: 'I Ching', icone: '\u262F\uFE0F', desc: 'Livro das mutações para decisões sábias e visão estratégica.' },
  orixas: { nome: 'Orixás', icone: '\uD83C\uDF0A', desc: 'Forças da natureza e regências espirituais da tradição afro-brasileira.' },
};

export default function OraclePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [routeError, setRouteError] = useState(false);

  useEffect(() => {
    if (!slug) { setLoading(false); setRouteError(true); return; }
    const normalized = slug.toLowerCase();
    if (!VALID_ORACLES.includes(normalized)) {
      setLoading(false);
      setRouteError(true);
      return;
    }
    setRouteError(false);
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E5C158] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (routeError || !slug) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-serif text-[#E5C158] mb-3">Rota não disponível</h1>
          <p className="text-slate-400 mb-6">Esta tradição ainda não está disponível para consulta neste momento.</p>
          <button onClick={() => router.push('/oraculos')}
            className="px-6 py-2 bg-slate-800 border border-[#E5C158] text-[#E5C158] rounded hover:bg-slate-700 transition-all text-sm">
            Voltar aos Oráculos
          </button>
        </div>
      </div>
    );
  }

  const info = ORACLE_INFO[slug];

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">{info?.icone}</div>
        <h1 className="text-3xl md:text-5xl font-serif text-[#E5C158] mb-2 tracking-wide">{info?.nome}</h1>
        <p className="text-slate-400 max-w-xl mx-auto leading-relaxed mt-4">{info?.desc}</p>
      </div>

      <OracleRenderer type={slug} />
    </div>
  );
}
