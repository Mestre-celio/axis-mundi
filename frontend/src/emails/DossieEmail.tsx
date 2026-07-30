import {
  Html, Head, Body, Container, Text, Heading, Button,
  Section, Hr, Tailwind,
} from '@react-email/components';

interface Props {
  nome: string;
  pdfUrl: string;
  tokenAcesso: string;
  oraculo: string;
}

export default function DossieEmail({ nome, pdfUrl, tokenAcesso, oraculo }: Props) {
  const firstName = nome.split(' ')[0];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://portal-axium.vercel.app';

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-slate-950 font-sans text-slate-200 p-4">
          <Container className="max-w-[600px] mx-auto bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
            <Section className="bg-gradient-to-r from-[#b8941f] to-[#E5D283] p-8 text-center">
              <Heading className="text-slate-950 text-3xl font-bold m-0 tracking-wide">
                Seu Dossiê está Pronto
              </Heading>
              <Text className="text-slate-900 text-sm italic mt-2 m-0">
                Portal Axium &bull; Sabedoria Ancestral
              </Text>
            </Section>

            <Section className="p-8">
              <Text className="text-lg mb-6">
                Saudações, <strong className="text-[#E5D283]">{firstName}</strong>.
              </Text>

              <Text className="text-base leading-relaxed mb-6 text-slate-300">
                Os arquétipos revelaram seus segredos. Seu <strong>Dossiê Completo</strong> do Oráculo de <strong className="text-[#E5D283]">{oraculo}</strong> foi compilado com profundidade analítica e respeito à sua jornada.
              </Text>

              <Section className="bg-slate-950 p-4 rounded-lg border border-slate-800 mb-6">
                <Text className="text-sm text-slate-400 m-0 mb-2">Seu Dossiê contém:</Text>
                <ul className="text-sm text-slate-300 space-y-1 pl-4">
                  <li>Alinhamento de Prosperidade e Arquétipo</li>
                  <li>Desconstrução completa da Matriz Simbólica</li>
                  <li>O Ponto de Virada e estratégias de desbloqueio</li>
                  <li>Rituais práticos de ativação</li>
                </ul>
              </Section>

              <Hr className="border-slate-800 my-6" />

              <Text className="text-center text-base mb-6">
                Clique no botão abaixo para acessar e baixar seu material exclusivo:
              </Text>

              <Button
                href={pdfUrl}
                className="bg-[#E5D283] text-slate-950 font-bold py-3 px-8 rounded-lg text-center block mx-auto text-base hover:bg-yellow-400 transition-colors no-underline"
              >
                ACESSAR MEU DOSSIÊ COMPLETO
              </Button>

              <Text className="text-center text-xs text-slate-500 mt-8">
                Token de acesso seguro: <span className="text-[#E5D283] font-mono">{tokenAcesso}</span><br />
                Este link é pessoal e intransferível.
              </Text>
            </Section>

            <Section className="bg-slate-950 p-6 text-center border-t border-slate-800">
              <Text className="text-slate-600 text-xs m-0">
                &copy; {new Date().getFullYear()} Portal Axium. Todos os direitos reservados.<br />
                Projeto solo de autoconhecimento e terapias integrativas.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
