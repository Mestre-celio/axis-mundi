'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, User, ScrollText, Calendar, LogOut, ExternalLink } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/painel-sacerdote', label: 'Visão Geral', icon: LayoutDashboard },
  { href: '/painel-sacerdote/dossies', label: 'Dossiês & Consultas', icon: ScrollText },
  { href: '/painel-sacerdote/perfil', label: 'Meu Perfil', icon: User },
  { href: '/painel-sacerdote/agenda', label: 'Minha Agenda', icon: Calendar },
];

interface Props {
  nomeRitual: string | null;
  slug: string | null;
}

export default function PainelNav({ nomeRitual, slug }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const sair = async () => {
    await fetch('/api/sacerdote/logout', { method: 'POST' });
    router.push('/sacerdote/login');
    router.refresh();
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-serif text-[#E5D283]">Painel Axium</h2>
        <p className="text-xs text-slate-400 mt-1 truncate">{nomeRitual}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icone = item.icon;
          const ativo = pathname === item.href || (item.href !== '/painel-sacerdote' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                ativo
                  ? 'bg-[#E5C158]/10 text-[#E5C158] border border-[#E5C158]/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-[#E5C158]'
              }`}
            >
              <Icone className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {slug && (
          <Link
            href={`/sacerdotes/${slug}`}
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-[#E5C158] transition-all"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Ver minha página</span>
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={sair}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
