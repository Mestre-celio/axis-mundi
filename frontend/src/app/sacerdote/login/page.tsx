'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SacerdoteLogin() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const response = await fetch('/api/sacerdote/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (response.ok) {
      const { sacerdoteId } = await response.json();
      localStorage.setItem('sacerdote_session', sacerdoteId);
      router.push('/sacerdote/painel');
    } else {
      setError('Token de acesso inválido.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🕯️</div>
          <h1 className="text-2xl font-serif text-[#E5D283]">Acesso do Sacerdote</h1>
          <p className="text-slate-400 text-sm mt-2">Portal Axium</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Token de Acesso</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#E5D283]"
              placeholder="Cole seu token pessoal"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-[#E5D283] text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </main>
  );
}
