import Link from 'next/link';
import { Emblem } from '@/components/brand/Emblem';

const oracles = [
  { slug: 'tarot', name: 'Tarot', icon: '🔮', trad: 'Ocidental', color: 'tarot' },
  { slug: 'ifa', name: 'Ifá', icon: '🌴', trad: 'Africana', color: 'orixas' },
  { slug: 'runas', name: 'Runas', icon: 'ᚱ', trad: 'Nórdica', color: 'runas' },
  { slug: 'iching', name: 'I Ching', icon: '☯', trad: 'Oriental', color: 'iching' },
  { slug: 'orixas', name: 'Orixás', icon: '🌊', trad: 'Africana', color: 'orixas' },
] as const;

const accentMap: Record<string, string> = {
  tarot: 'rgba(157, 78, 221, 0.6)',
  runas: 'rgba(58, 134, 255, 0.6)',
  iching: 'rgba(0, 245, 212, 0.6)',
  orixas: 'rgba(255, 0, 127, 0.6)',
};

export default function Home() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="min-h-[90vh] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1F0B38_0%,#040208_70%)]" />
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <div className="mb-8">
            <span className="font-display text-xs tracking-[0.35em] text-[#D8B4F8] uppercase">
              Filosofia &amp; Arquétipos Cósmicos
            </span>
          </div>

          <div className="flex justify-center mb-6">
            <Emblem />
          </div>

          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-[0.35em] mb-6"
            style={{
              background: 'linear-gradient(135deg, #FFF5C0 0%, #E5C158 50%, #946E19 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            PORTAL AXIUM
          </h1>

          <p className="text-sm tracking-[0.45em] text-[#D8B4F8] uppercase mb-4 opacity-90 font-light">
            O eixo do mundo onde o céu encontra a terra
          </p>

          <div className="w-[180px] h-[1px] mx-auto mb-10"
            style={{ background: 'linear-gradient(90deg, transparent, #E5C158, transparent)', opacity: 0.6 }}
          />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/oraculos"
              className="px-10 py-3 rounded font-medium text-sm tracking-wider uppercase transition-all duration-300"
              style={{
                background: '#E5C158',
                color: '#040208',
                boxShadow: '0 0 20px rgba(229, 193, 88, 0.3)',
              }}
              onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 0 30px rgba(229, 193, 88, 0.5)' }}
              onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(229, 193, 88, 0.3)' }}
            >
              Explorar Oráculos
            </Link>
            <Link
              href="/register"
              className="px-10 py-3 rounded font-medium text-sm tracking-wider uppercase transition-all duration-300 border"
              style={{ borderColor: 'rgba(229, 193, 88, 0.3)', color: '#E5C158' }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(229, 193, 88, 0.1)' }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </section>

      {/* ORÁCULOS */}
      <section className="py-24 px-4 border-t" style={{ borderColor: 'rgba(229, 193, 88, 0.1)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl mb-4"
              style={{
                background: 'linear-gradient(135deg, #FFF5C0 0%, #E5C158 50%, #946E19 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Os Oráculos
            </h2>
            <p className="text-[#D8B4F8] max-w-xl mx-auto text-sm tracking-wider">
              Cinco tradições, um eixo. Cada oráculo é uma porta para a sabedoria que conecta todos os caminhos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {oracles.map((o) => (
              <Link
                key={o.slug}
                href={`/oraculos/${o.slug}`}
                className="group flex flex-col items-center p-6 rounded-xl transition-all duration-300"
                style={{
                  background: 'rgba(31, 11, 56, 0.5)',
                  border: '1px solid rgba(229, 193, 88, 0.1)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = accentMap[o.color];
                  e.currentTarget.style.boxShadow = `0 0 20px ${accentMap[o.color].replace('0.6', '0.1')}`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(229, 193, 88, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {o.icon}
                </span>
                <span className="font-display text-sm" style={{ color: '#E5C158' }}>{o.name}</span>
                <span className="text-xs mt-1 opacity-50" style={{ color: '#D8B4F8' }}>{o.trad}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CITAÇÃO */}
      <section className="py-24 px-4" style={{ background: 'rgba(10, 6, 24, 0.5)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-cinzel text-2xl md:text-3xl mb-6 text-gray-200 font-light italic">
            &ldquo;O conhecimento é a ponte entre os mundos&rdquo;
          </h2>
          <p className="text-sm max-w-lg mx-auto opacity-60" style={{ color: '#D8B4F8' }}>
            Cada leitura é um dossiê astrológico-arquetípico único, gerado por IA com profundo respeito às tradições.
          </p>
        </div>
      </section>
    </div>
  );
}
