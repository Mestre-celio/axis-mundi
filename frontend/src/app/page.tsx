import Link from 'next/link';
import { Emblem } from '@/components/brand/Emblem';

const oracles = [
  { slug: 'tarot', name: 'Tarot', icon: '🔮', trad: 'Ocidental', border: 'hover:border-[#9D4EDD] hover:shadow-[#9D4EDD]/10' },
  { slug: 'ifa', name: 'Ifá', icon: '🌴', trad: 'Africana', border: 'hover:border-[#FF007F] hover:shadow-[#FF007F]/10' },
  { slug: 'runas', name: 'Runas', icon: 'ᚱ', trad: 'Nórdica', border: 'hover:border-[#3A86FF] hover:shadow-[#3A86FF]/10' },
  { slug: 'iching', name: 'I Ching', icon: '☯', trad: 'Oriental', border: 'hover:border-[#00F5D4] hover:shadow-[#00F5D4]/10' },
  { slug: 'orixas', name: 'Orixás', icon: '🌊', trad: 'Africana', border: 'hover:border-[#FF007F] hover:shadow-[#FF007F]/10' },
];

export default function Home() {
  return (
    <div className="relative">
      <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#3A0A6B_0%,#1F0B38_40%,#040208_100%)]" />

        <div className="text-center max-w-4xl mx-auto relative z-10">
          <div className="mb-4">
            <span className="font-display text-xs tracking-[0.35em] text-[#DCC698] uppercase">
              Filosofia &amp; Arquétipos Cósmicos
            </span>
          </div>

          <div className="flex justify-center mb-8 relative">
            <div
              className="absolute top-1/2 left-1/2 w-[280px] md:w-[400px] h-[280px] md:h-[400px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(229,193,88,0.35) 0%, rgba(76,11,139,0) 70%)',
                filter: 'blur(30px)',
                animation: 'portalPulse 4s ease-in-out infinite alternate',
              }}
            />
            <div className="relative w-full max-w-[320px] md:max-w-[480px]">
              <Emblem />
            </div>
          </div>

          <h1
            className="font-display text-5xl md:text-7xl uppercase tracking-[0.35em] mb-6"
            style={{
              color: '#E5C158',
              textShadow: '0 0 20px rgba(229,193,88,0.5), 0 0 60px rgba(229,193,88,0.2)',
            }}
          >
            PORTAL AXIUM
          </h1>

          <p className="text-sm tracking-[0.45em] text-[#DCC698] uppercase mb-6 opacity-90 font-light">
            O eixo do mundo onde o céu encontra a terra
          </p>

          <div className="w-[180px] h-[1px] mx-auto mb-10 bg-gold-divider opacity-60" />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/oraculos"
              className="px-10 py-3.5 rounded font-medium text-sm tracking-wider uppercase transition-all duration-300 bg-[#E5C158] text-[#090216] shadow-[0_0_25px_rgba(229,193,88,0.4)] hover:bg-[#FFF3A3] hover:shadow-[0_0_40px_rgba(229,193,88,0.7)]"
            >
              Consultar Oráculo
            </Link>
            <Link
              href="/dashboard"
              className="px-10 py-3.5 rounded font-medium text-sm tracking-wider uppercase transition-all duration-300 border border-[#E5C158]/40 text-[#E5C158] hover:bg-[#E5C158]/10"
              style={{
                textShadow: '0 0 10px rgba(229,193,88,0.3)',
              }}
            >
              Entrar no Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 border-t border-[#E5C158]/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl mb-4 text-gold-gradient">
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
                className={`group flex flex-col items-center p-6 rounded-xl transition-all duration-300 bg-[#1F0B38]/50 border border-[#E5C158]/10 ${o.border} hover:shadow-lg`}
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {o.icon}
                </span>
                <span className="font-display text-sm text-[#E5C158]">{o.name}</span>
                <span className="text-xs mt-1 text-[#D8B4F8]/50">{o.trad}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-[#0A0618]/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl mb-6 text-gray-200 font-light italic">
            &ldquo;O conhecimento é a ponte entre os mundos&rdquo;
          </h2>
          <p className="text-sm max-w-lg mx-auto text-[#D8B4F8]/60">
            Cada leitura é um dossiê astrológico-arquetípico único, gerado por IA com profundo respeito às tradições.
          </p>
        </div>
      </section>
    </div>
  );
}
