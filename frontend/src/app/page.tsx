import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative">
      <section className="min-h-[90vh] flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="font-display text-xs tracking-[0.3em] text-gold-500/60 uppercase">
              Portal Oracle das Religiões
            </span>
          </div>

          <h1 className="heading-display text-gold-500 mb-6 leading-tight">
            Axis Mundi
          </h1>

          <p className="heading-serif text-gray-300 text-balance mb-12 leading-relaxed max-w-2xl mx-auto">
            O eixo do mundo onde o céu encontra a terra.
            <br />
            Sabedoria ancestral dos oráculos em um templo digital.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/oraculos"
              className="px-8 py-3 bg-gold-500 text-midnight-900 rounded font-medium hover:bg-gold-600 transition-all shadow-lg shadow-gold-500/20"
            >
              Explorar Oráculos
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 border border-gold-500/30 text-gold-500 rounded font-medium hover:bg-gold-500/10 transition-all"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 border-t border-gold-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-display text-3xl md:text-4xl text-gold-500 mb-4">
              Os Oráculos
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Cinco tradições, um eixo. Cada oráculo é uma porta para a sabedoria que conecta todos os caminhos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { slug: 'tarot', name: 'Tarot', icon: '🔮', trad: 'Ocidental' },
              { slug: 'ifa', name: 'Ifá', icon: '🌴', trad: 'Africana' },
              { slug: 'runas', name: 'Runas', icon: 'ᚱ', trad: 'Nórdica' },
              { slug: 'iching', name: 'I Ching', icon: '☯', trad: 'Oriental' },
              { slug: 'orixas', name: 'Orixás', icon: '🌊', trad: 'Africana' },
            ].map((o) => (
              <Link
                key={o.slug}
                href={`/oraculos/${o.slug}`}
                className="group flex flex-col items-center p-6 rounded-xl bg-midnight-400/30 border border-gold-500/10 hover:border-gold-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/5"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {o.icon}
                </span>
                <span className="font-display text-sm text-gold-500">{o.name}</span>
                <span className="text-xs text-gray-600 mt-1">{o.trad}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-midnight-500/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="heading-serif text-2xl md:text-3xl text-gray-200 mb-6">
            &ldquo;O conhecimento é a ponte entre os mundos&rdquo;
          </h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Cada leitura é um dossiê astrológico-arquetípico único, gerado por IA com profundo respeito às tradições.
          </p>
        </div>
      </section>
    </div>
  );
}
