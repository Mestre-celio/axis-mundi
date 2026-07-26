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
    <header className="fixed top-0 left-0 right-0 z-50 bg-midnight-500/80 backdrop-blur-md border-b border-gold-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl text-gold-500">AXIS MUNDI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/oraculos" className="text-sm text-gray-300 hover:text-gold-500 transition-colors">
              Oráculos
            </Link>
            <Link href="/dashboard" className="text-sm text-gray-300 hover:text-gold-500 transition-colors">
              Dashboard
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-gold-500"
                >
                  <User className="w-4 h-4" />
                  Perfil
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-mystical-rose transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm text-gray-300 hover:text-gold-500 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-gold-500 text-midnight-900 px-4 py-2 rounded hover:bg-gold-600 transition-colors"
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
        'md:hidden border-t border-gold-500/10 bg-midnight-500/95 backdrop-blur-md',
        menuOpen ? 'block' : 'hidden'
      )}>
        <div className="px-4 py-4 space-y-3">
          <Link href="/oraculos" className="block text-gray-300" onClick={() => setMenuOpen(false)}>
            Oráculos
          </Link>
          <Link href="/dashboard" className="block text-gray-300" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          {user ? (
            <button onClick={() => { signOut(); setMenuOpen(false); }} className="block text-gray-400">
              Sair
            </button>
          ) : (
            <>
              <Link href="/login" className="block text-gray-300" onClick={() => setMenuOpen(false)}>
                Entrar
              </Link>
              <Link href="/register" className="block text-gold-500" onClick={() => setMenuOpen(false)}>
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
