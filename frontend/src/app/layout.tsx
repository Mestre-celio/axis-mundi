import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Stars } from '@/components/layout/Stars';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Portal Axium — Oráculo e Autoconhecimento',
  description: 'Onde a sabedoria ancestral encontra a tecnologia. Tarot, Ifá, Runas, I Ching e Orixás em um só templo digital.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col">
        <Stars />
        <Header />
        <main className="flex-grow relative z-10 pt-16">
          {children}
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0a0a1a',
              color: '#e6e6f0',
              border: '1px solid rgba(212, 175, 55, 0.2)',
            },
            success: { iconTheme: { primary: '#d4af37', secondary: '#0a0a1a' } },
          }}
        />
      </body>
    </html>
  );
}
