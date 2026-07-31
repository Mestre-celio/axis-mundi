'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';

interface Props {
  sacerdote: {
    nome_ritual: string | null;
    titulo: string | null;
    bio: string | null;
    especialidade: string | null;
    explicacao_iniciacao: string | null;
    foto_perfil_url: string | null;
    banner_url: string | null;
    video_apresentacao_id: string | null;
    whatsapp: string | null;
  };
}

export default function PerfilForm({ sacerdote }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    nome_ritual: sacerdote.nome_ritual || '',
    titulo: sacerdote.titulo || '',
    especialidade: sacerdote.especialidade || '',
    bio: sacerdote.bio || '',
    explicacao_iniciacao: sacerdote.explicacao_iniciacao || '',
    foto_perfil_url: sacerdote.foto_perfil_url || '',
    banner_url: sacerdote.banner_url || '',
    video_apresentacao_id: sacerdote.video_apresentacao_id || '',
    whatsapp: sacerdote.whatsapp || '',
  });
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ ok: boolean; texto: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMensagem(null);
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem(null);
    try {
      const res = await fetch('/api/sacerdote/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMensagem({ ok: true, texto: 'Perfil atualizado com sucesso!' });
        router.refresh();
      } else {
        setMensagem({ ok: false, texto: data.error || 'Erro ao salvar.' });
      }
    } catch {
      setMensagem({ ok: false, texto: 'Erro de conexão.' });
    } finally {
      setSalvando(false);
    }
  };

  const inputCls =
    'w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#E5C158] transition-colors text-sm';
  const labelCls = 'block text-sm font-medium text-slate-300 mb-2';

  return (
    <form onSubmit={salvar} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Nome Ritual (público)</label>
          <input name="nome_ritual" value={form.nome_ritual} onChange={handleChange} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Título</label>
          <input
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            className={inputCls}
            placeholder="Ex: Fundador e Guardião do Portal"
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Especialidade principal</label>
        <input
          name="especialidade"
          value={form.especialidade}
          onChange={handleChange}
          className={inputCls}
          placeholder="Ex: Tarô Evolutivo"
        />
      </div>

      <div>
        <label className={labelCls}>Bio (aparece no card e no hero)</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows={3}
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Linhagem e Formação</label>
        <textarea
          name="explicacao_iniciacao"
          value={form.explicacao_iniciacao}
          onChange={handleChange}
          rows={6}
          className={inputCls}
          placeholder="Conte sua iniciação, linhagem e formação..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>URL da foto de perfil</label>
          <input
            name="foto_perfil_url"
            value={form.foto_perfil_url}
            onChange={handleChange}
            className={inputCls}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className={labelCls}>URL do banner</label>
          <input
            name="banner_url"
            value={form.banner_url}
            onChange={handleChange}
            className={inputCls}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>ID do vídeo de apresentação (Bunny.net)</label>
          <input
            name="video_apresentacao_id"
            value={form.video_apresentacao_id}
            onChange={handleChange}
            className={inputCls}
            placeholder="GUID do vídeo no Bunny"
          />
        </div>
        <div>
          <label className={labelCls}>WhatsApp</label>
          <input
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            className={inputCls}
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>

      {mensagem && (
        <p className={`text-sm ${mensagem.ok ? 'text-green-400' : 'text-red-400'}`}>
          {mensagem.ok ? '✓ ' : '✗ '}
          {mensagem.texto}
        </p>
      )}

      <button
        type="submit"
        disabled={salvando}
        className="inline-flex items-center gap-2 px-8 py-3 bg-[#E5C158] text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-4 h-4" />
        {salvando ? 'Salvando...' : 'Salvar Perfil'}
      </button>
    </form>
  );
}
