import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import BunnyPlayer from '@/components/videos/BunnyPlayer';
import { rotuloTradicao, estrelas } from '@/lib/sacerdoteUtils';
import {
  ChevronLeft,
  Crown,
  Sparkles,
  ScrollText,
  Clock,
  Star,
  Film,
  FileText,
  Video,
  MessageCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = getSupabaseAdmin();

  const { data: sacerdote } = await supabase
    .from('sacerdotes_parceiros')
    .select('nome_ritual, tradicao_principal, bio, foto_perfil_url')
    .eq('slug', slug)
    .eq('ativo', true)
    .eq('pagina_ativa', true)
    .maybeSingle();

  if (!sacerdote) {
    return { title: 'Sacerdote não encontrado | Portal Axium' };
  }

  const tradicao = sacerdote.tradicao_principal ? ` · ${rotuloTradicao(sacerdote.tradicao_principal)}` : '';
  return {
    title: `${sacerdote.nome_ritual}${tradicao} | Portal Axium`,
    description: sacerdote.bio
      ? `${sacerdote.bio.slice(0, 152)}...`
      : `Consultas e dossiês com ${sacerdote.nome_ritual}.`,
    openGraph: {
      title: `${sacerdote.nome_ritual} | Portal Axium`,
      description: sacerdote.bio?.slice(0, 152),
      images: sacerdote.foto_perfil_url ? [{ url: sacerdote.foto_perfil_url }] : undefined,
    },
  };
}

export default async function SacerdotePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = getSupabaseAdmin();

  const { data: sacerdote } = await supabase
    .from('sacerdotes_parceiros')
    .select('*')
    .eq('slug', slug)
    .eq('ativo', true)
    .eq('pagina_ativa', true)
    .maybeSingle();

  if (!sacerdote) notFound();

  const { data: avaliacoes } = await supabase
    .from('avaliacoes_sacerdote')
    .select('id, nome_consulente, nota, comentario, created_at')
    .eq('sacerdote_id', sacerdote.id)
    .eq('is_aprovado', true)
    .order('created_at', { ascending: false })
    .limit(3);

  const { data: conteudos } = await supabase
    .from('conteudos_video')
    .select('id, titulo, slug, tipo, capa_url, duracao_estimada, descricao')
    .eq('autor_id', sacerdote.id)
    .eq('status', 'publicado')
    .order('published_at', { ascending: false })
    .limit(3);

  const tradicoes: string[] = sacerdote.tradicoes || (sacerdote.tradicao_principal ? [sacerdote.tradicao_principal] : []);
  const especialidades: string[] = sacerdote.especialidades || [];

  const servicos = [
    {
      titulo: 'Dossiê Completo + Análise Sacerdotal',
      descricao: 'Mapeamento arquetípico completo com a análise pessoal deste sacerdote.',
      preco: 'R$ 197',
      icone: FileText,
      href: `/checkout?service=dossie-completo&oracle=taro&sacerdote=${slug}`,
    },
    {
      titulo: 'Consulta ao Vivo',
      descricao: 'Sessão individual por vídeo ou áudio com {nome}. Agendamento pelo contato.',
      preco: 'Sob consulta',
      icone: Video,
      href: `/contato?sacerdote=${slug}`,
    },
    {
      titulo: 'Leitura Rápida de Oráculo',
      descricao: 'Tiragem focada em uma questão, com o olhar e o método deste sacerdote.',
      preco: 'R$ 97',
      icone: Sparkles,
      href: `/checkout?service=leitura-rapida&oracle=taro&sacerdote=${slug}`,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1021] via-slate-950 to-slate-950" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E5C158]/10 blur-[140px] rounded-full" />
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <Link
            href="/sacerdotes"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#E5C158] transition-colors mb-10"
          >
            <ChevronLeft className="w-4 h-4" /> Todos os Sacerdotes
          </Link>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <div className="relative shrink-0">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-[#E5C158]/40 shadow-2xl shadow-black/50">
                {sacerdote.foto_perfil_url || sacerdote.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sacerdote.foto_perfil_url || sacerdote.foto_url}
                    alt={sacerdote.nome_ritual || sacerdote.nome}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <Crown className="w-16 h-16 text-[#E5C158]/40" />
                  </div>
                )}
              </div>
              {sacerdote.nota_media > 0 && (
                <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-[#E5C158]/40 rounded-full px-3 py-1.5 flex items-center gap-1 text-sm shadow-lg">
                  <span className="text-[#E5C158]">{estrelas(sacerdote.nota_media)}</span>
                  <span className="font-bold">{Number(sacerdote.nota_media).toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {tradicoes.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-[#E5C158]/15 text-[#E5C158] border border-[#E5C158]/40 text-xs font-semibold"
                  >
                    {rotuloTradicao(t)}
                  </span>
                ))}
                {sacerdote.anos_experiencia > 0 && (
                  <span className="px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#E5C158]" /> {sacerdote.anos_experiencia} anos de prática
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-[#E5D283] tracking-wide">
                {sacerdote.nome_ritual || sacerdote.nome}
              </h1>
              {sacerdote.titulo && <p className="text-lg text-slate-300 italic">{sacerdote.titulo}</p>}
              {sacerdote.bio && <p className="text-slate-400 max-w-2xl leading-relaxed">{sacerdote.bio}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Linhagem */}
      {sacerdote.explicacao_iniciacao && (
        <section className="max-w-4xl mx-auto px-4 py-14">
          <div className="bg-slate-900/60 border border-[#E5C158]/20 rounded-2xl p-8 md:p-10">
            <h2 className="flex items-center gap-3 font-serif text-2xl text-[#E5C158] mb-6">
              <ScrollText className="w-6 h-6" /> Linhagem e Formação
            </h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {sacerdote.explicacao_iniciacao}
            </p>
          </div>
        </section>
      )}

      {/* Vídeo de apresentação */}
      {sacerdote.video_apresentacao_id && (
        <section className="max-w-4xl mx-auto px-4 py-6">
          <h2 className="flex items-center gap-3 font-serif text-2xl text-[#E5C158] mb-6">
            <Film className="w-6 h-6" /> Apresentação
          </h2>
          <BunnyPlayer videoGuid={sacerdote.video_apresentacao_id} title={`Apresentação de ${sacerdote.nome_ritual || sacerdote.nome}`} />
        </section>
      )}

      {/* Conteúdos do sacerdote */}
      {conteudos && conteudos.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="flex items-center gap-3 font-serif text-2xl text-[#E5C158] mb-8">
            <Sparkles className="w-6 h-6" /> Ensinamentos de {sacerdote.nome_ritual?.split(' ')[0] || sacerdote.nome}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {conteudos.map((c: any) => (
              <Link
                key={c.id}
                href={`/catalogo/${c.slug}`}
                className="group rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all hover:border-[#E5C158]/50"
              >
                <div className="relative aspect-video overflow-hidden">
                  {c.capa_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.capa_url} alt={c.titulo} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
                      <Film className="w-8 h-8 text-[#E5C158]/40" />
                    </div>
                  )}
                </div>
                <div className="p-5 space-y-2">
                  <p className="text-xs text-[#E5C158] uppercase tracking-wider">{c.tipo}</p>
                  <h3 className="font-serif text-lg text-[#E5D283] group-hover:text-yellow-400 transition-colors">
                    {c.titulo}
                  </h3>
                  {c.duracao_estimada && (
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {c.duracao_estimada} min
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Serviços */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="font-serif text-2xl text-[#E5C158] mb-8 text-center">Serviços com {sacerdote.nome_ritual?.split(' ')[0] || 'este sacerdote'}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {servicos.map((s) => {
            const Icone = s.icone;
            return (
              <a
                key={s.titulo}
                href={s.href}
                className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 transition-all hover:border-[#E5C158]/60 hover:shadow-lg hover:shadow-[#E5C158]/5 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E5C158]/10 border border-[#E5C158]/30 flex items-center justify-center">
                  <Icone className="w-6 h-6 text-[#E5C158]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-[#E5D283] mb-2">{s.titulo}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {s.descricao.replace('{nome}', sacerdote.nome_ritual || sacerdote.nome)}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="font-bold text-[#E5C158]">{s.preco}</span>
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-[#E5C158] transition-colors">
                    {s.href.startsWith('/contato') ? 'Agendar →' : 'Comprar →'}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Avaliações */}
      {avaliacoes && avaliacoes.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="flex items-center gap-3 font-serif text-2xl text-[#E5C158] mb-8">
            <MessageCircle className="w-6 h-6" /> O que dizem os consulentes
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {avaliacoes.map((a) => (
              <div key={a.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{a.nome_consulente || 'Consulente'}</span>
                  <span className="text-[#E5C158]">{estrelas(a.nota)}</span>
                </div>
                {a.comentario && <p className="text-sm text-slate-400 leading-relaxed">{a.comentario}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-[#E5D283]/30 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-serif text-[#E5D283] mb-4">
            Escolha {sacerdote.nome_ritual || sacerdote.nome} para sua próxima tiragem
          </h2>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            Ao finalizar sua tiragem, adicione a análise pessoal deste sacerdote ao seu Dossiê Completo
            e receba uma leitura guiada pela sua linhagem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/checkout?service=dossie-completo&oracle=taro&sacerdote=${slug}`}
              className="px-8 py-3 bg-[#E5D283] text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all"
            >
              Dossiê Completo com {sacerdote.nome_ritual?.split(' ')[0] || 'ele(a)'}
            </a>
            <a
              href="/oraculos"
              className="px-8 py-3 bg-slate-800 border border-[#E5C158]/40 text-[#E5C158] font-bold rounded-lg hover:bg-slate-700 transition-all"
            >
              Fazer uma Tiragem Grátis
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
