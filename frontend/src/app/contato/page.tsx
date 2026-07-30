'use client';

import { useState } from 'react';

const FAQ_ITEMS = [
  {
    pergunta: 'Quanto tempo leva para receber o Dossiê Completo?',
    resposta: 'O Dossiê Completo é entregue em até 48 horas úteis após a confirmação do pagamento. Você receberá o material completo no e-mail e WhatsApp informados.',
  },
  {
    pergunta: 'Como funciona o atendimento personalizado?',
    resposta: 'Após receber seu Dossiê, você pode agendar uma consulta de 1 hora com o sacerdote responsável para aprofundar a leitura e tirar todas as suas dúvidas.',
  },
  {
    pergunta: 'As leituras gratuitas são realmente gratuitas?',
    resposta: 'Sim! As leituras gratuitas são uma degustação analítica para você conhecer a qualidade do nosso trabalho. Não há cobrança oculta ou compromisso de compra.',
  },
  {
    pergunta: 'Posso escolher qual sacerdote fará minha leitura?',
    resposta: 'Sim. Na página de checkout, você pode selecionar o sacerdote de sua preferência. Cada mestre tem especialidades diferentes (Tarô, Runas, Búzios, Astrologia, etc).',
  },
  {
    pergunta: 'Os pagamentos são seguros?',
    resposta: 'Sim. Utilizamos a plataforma Asaas para processamento de pagamentos via PIX, com total segurança e criptografia de dados.',
  },
  {
    pergunta: 'Vocês atendem presencialmente?',
    resposta: 'O Portal Axium atende presencialmente em nossa sede mediante agendamento prévio. Entre em contato para verificar disponibilidade.',
  },
];

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#E5D283] tracking-wide">
            Entre em Contato
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Estamos aqui para ajudar. Envie sua dúvida, sugestão ou solicite um agendamento personalizado.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-serif text-[#E5D283] mb-6">Envie sua Mensagem</h2>
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="text-5xl">✨</div>
                <h3 className="text-xl text-[#E5D283] font-serif">Mensagem Enviada!</h3>
                <p className="text-slate-400">
                  Recebemos sua mensagem e retornaremos em até 24 horas úteis.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition-all"
                >
                  Enviar Nova Mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-slate-300 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#E5D283] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#E5D283] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="assunto" className="block text-sm font-medium text-slate-300 mb-2">
                    Assunto *
                  </label>
                  <select
                    id="assunto"
                    name="assunto"
                    required
                    value={formData.assunto}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#E5D283] transition-colors"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="duvida">Dúvida sobre os oráculos</option>
                    <option value="agendamento">Agendamento de consulta</option>
                    <option value="dossie">Informações sobre o Dossiê Completo</option>
                    <option value="suporte">Suporte técnico</option>
                    <option value="outro">Outro assunto</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="mensagem" className="block text-sm font-medium text-slate-300 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    required
                    rows={5}
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#E5D283] transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#E5D283] text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all shadow-lg hover:shadow-[#E5D283]/20"
                >
                  Enviar Mensagem
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-900/30 to-slate-900 border border-green-800/50 rounded-xl p-6 md:p-8">
              <div className="text-center space-y-4">
                <div className="text-5xl">💬</div>
                <h2 className="text-2xl font-serif text-[#E5D283]">Atendimento via WhatsApp</h2>
                <p className="text-slate-300 text-sm">
                  Prefere uma resposta mais rápida? Fale diretamente conosco pelo WhatsApp.
                </p>
                <a
                  href="https://wa.me/5511999999999?text=Olá! Gostaria de mais informações sobre o Portal Axium."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-all shadow-lg"
                >
                  Abrir Conversa no WhatsApp
                </a>
                <p className="text-slate-500 text-xs">
                  Horário de atendimento: Seg a Sex, 9h às 18h
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-serif text-[#E5D283] mb-4">Outras Formas de Contato</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="text-slate-400 text-sm">E-mail</p>
                    <a href="mailto:contato@portalaxium.com" className="text-slate-200 hover:text-[#E5D283] transition-colors">
                      contato@portalaxium.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-slate-400 text-sm">Endereço</p>
                    <p className="text-slate-200">
                      Portal Axium<br />
                      Brasil
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🕐</span>
                  <div>
                    <p className="text-slate-400 text-sm">Horário de Atendimento</p>
                    <p className="text-slate-200">
                      Segunda a Sexta: 9h às 18h<br />
                      Sábado: 9h às 13h
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-[#E5D283] mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-slate-400">
            Encontre respostas para as dúvidas mais comuns
          </p>
        </div>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
              >
                <span className="text-slate-200 font-medium">{item.pergunta}</span>
                <span className={`text-[#E5D283] text-2xl transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {openFaq === index && (
                <div className="px-6 pb-4 pt-2 border-t border-slate-800">
                  <p className="text-slate-300 leading-relaxed">{item.resposta}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-[#E5D283]/30 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-serif text-[#E5D283] mb-4">
            Pronto para começar sua jornada?
          </h2>
          <p className="text-slate-300 mb-6">
            Explore nossos oráculos gratuitos e descubra o que os arquétipos têm a revelar sobre seu momento atual.
          </p>
          <a
            href="/oraculos"
            className="inline-block px-8 py-3 bg-[#E5D283] text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-all shadow-lg hover:shadow-[#E5D283]/20"
          >
            Acessar os Oráculos
          </a>
        </div>
      </section>
    </main>
  );
}
