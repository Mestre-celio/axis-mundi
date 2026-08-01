'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0618]/80 backdrop-blur-md border-b" style={{ borderColor: 'rgba(229, 193, 88, 0.1)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl" style={{
              background: 'linear-gradient(135deg, #FFF5C0 0%, #E5C158 50%, #946E19 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>PORTAL AXIUM</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/oraculos" className="text-sm text-gray-300 hover:text-[#E5C158] transition-colors">
              Oráculos
            </Link>
            <Link href="/sacerdotes" className="text-sm text-gray-300 hover:text-[#E5C158] transition-colors">
              Sacerdotes
            </Link>
            <Link href="/tradicoes" className="text-sm text-gray-300 hover:text-[#E5C158] transition-colors">
              Tradições
            </Link>
            <Link href="/dashboard" className="text-sm text-gray-300 hover:text-[#E5C158] transition-colors">
              Dashboard
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/diario"
                  className="text-sm text-[#D8B4F8] hover:text-white transition-colors"
                >
                  Diário
                </Link>
                <Link
                  href="/diario/grimorio"
                  className="text-sm text-[#D8B4F8] hover:text-white transition-colors"
                >
                  Grimório
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#E5C158]"
                >
                  <User className="w-4 h-4" />
                  Perfil
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#D8B4F8] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm text-gray-300 hover:text-[#E5C158] transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="text-sm px-4 py-2 rounded transition-all duration-300"
                  style={{
                    background: '#E5C158',
                    color: '#040208',
                  }}
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </nav>

          <button
            className="md:hidden text-gray-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div className={cn(
        'md:hidden border-t bg-[#0A0618]/95 backdrop-blur-md',
        menuOpen ? 'block' : 'hidden'
      )} style={{ borderColor: 'rgba(229, 193, 88, 0.1)' }}>
        <div className="px-4 py-4 space-y-3">
          <Link href="/oraculos" className="block text-gray-300" onClick={() => setMenuOpen(false)}>
            Oráculos
          </Link>
          <Link href="/sacerdotes" className="block text-gray-300" onClick={() => setMenuOpen(false)}>
            Sacerdotes
          </Link>
          <Link href="/tradicoes" className="block text-gray-300" onClick={() => setMenuOpen(false)}>
            Tradições
          </Link>
          <Link href="/dashboard" className="block text-gray-300" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          {user ? (
            <>
              <Link href="/diario" className="block text-[#D8B4F8]" onClick={() => setMenuOpen(false)}>
                Diário
              </Link>
              <Link href="/diario/grimorio" className="block text-[#D8B4F8]" onClick={() => setMenuOpen(false)}>
                Grimório
              </Link>
              <button onClick={() => { signOut(); setMenuOpen(false); }} className="block text-gray-400">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-gray-300" onClick={() => setMenuOpen(false)}>
                Entrar
              </Link>
              <Link href="/register" className="block text-[#E5C158]" onClick={() => setMenuOpen(false)}>
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
