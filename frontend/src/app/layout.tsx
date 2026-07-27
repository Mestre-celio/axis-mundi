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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#040208]">
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
              background: '#1F0B38',
              color: '#D8B4F8',
              border: '1px solid rgba(229, 193, 88, 0.2)',
            },
            success: { iconTheme: { primary: '#E5C158', secondary: '#1F0B38' } },
          }}
        />
      </body>
    </html>
  );
}
