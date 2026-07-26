'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password, name);
      toast.success('Conta criada! Verifique seu email.');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card variant="glass" className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl text-gold-500 mb-2">Criar Conta</h1>
          <p className="text-sm text-gray-500">Inicie sua jornada no Axis Mundi</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-midnight-600 border border-gold-500/20 rounded-lg px-4 py-2.5 text-gray-200 focus:border-gold-500/50 focus:outline-none transition-colors"
              placeholder="Seu nome"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-midnight-600 border border-gold-500/20 rounded-lg px-4 py-2.5 text-gray-200 focus:border-gold-500/50 focus:outline-none transition-colors"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-midnight-600 border border-gold-500/20 rounded-lg px-4 py-2.5 text-gray-200 focus:border-gold-500/50 focus:outline-none transition-colors"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </div>
          <Button type="submit" loading={loading} className="w-full" size="lg">
            Criar Conta
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Já tem conta?{' '}
          <Link href="/login" className="text-gold-500 hover:text-gold-400">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
