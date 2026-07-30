import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Cinzel',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/cinzel/v23/8vIU7ww63mVu7gtR-kwKxNvkNOjw-tbnfYPlDX5Z.woff2', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/cinzel/v23/8vIU7ww63mVu7gtR-kwKxNvkNOjw-tbnfYPlDX5Z.woff2', fontWeight: 500 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 48,
    backgroundColor: '#040208',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 32,
    textAlign: 'center' as const,
    borderBottom: '1px solid #E5C158',
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    color: '#E5C158',
    fontFamily: 'Cinzel',
    letterSpacing: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: '#DCC698',
    letterSpacing: 2,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    border: '1px solid rgba(229,193,88,0.3)',
    borderRadius: 8,
    backgroundColor: '#0B1021',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#E5C158',
    fontFamily: 'Cinzel',
    marginBottom: 8,
    letterSpacing: 1,
  },
  bodyText: {
    fontSize: 10,
    color: '#cbd5e1',
    lineHeight: 1.6,
  },
  highlight: {
    backgroundColor: 'rgba(229,193,88,0.1)',
    padding: 8,
    borderLeft: '2px solid #E5C158',
    marginVertical: 8,
  },
  footer: {
    position: 'absolute' as const,
    bottom: 32,
    left: 48,
    right: 48,
    textAlign: 'center' as const,
    color: '#64748b',
    fontSize: 8,
    borderTop: '1px solid rgba(229,193,88,0.1)',
    paddingTop: 12,
  },
  symbolGrid: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    gap: 8,
    marginVertical: 12,
  },
  symbol: {
    backgroundColor: 'rgba(229,193,88,0.15)',
    border: '1px solid rgba(229,193,88,0.4)',
    borderRadius: 4,
    padding: '6 10',
    fontSize: 9,
    color: '#E5C158',
    textAlign: 'center' as const,
  },
  goldText: {
    color: '#E5C158',
  },
});

interface Props {
  nome: string;
  oraculo: string;
  symbols: string[];
  reading: {
    prosperidade: string;
    matriz: string;
    pontoDeVirada: string;
    aprofundamento?: string;
    rituais?: string;
    datas?: string;
  };
  sacerdote?: string;
  tokenAcesso: string;
}

export default function DossieDocument({ nome, oraculo, symbols, reading, sacerdote, tokenAcesso }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>PORTAL AXIUM</Text>
          <Text style={styles.subtitle}>Dossiê Astrológico-Arquetípico</Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={[styles.bodyText, { marginBottom: 4 }]}>
            Consultante: <Text style={styles.goldText}>{nome}</Text>
          </Text>
          <Text style={[styles.bodyText, { marginBottom: 4 }]}>
            Oráculo: <Text style={styles.goldText}>{oraculo}</Text>
          </Text>
          {sacerdote && (
            <Text style={[styles.bodyText, { marginBottom: 4 }]}>
              Sacerdote Responsável: <Text style={styles.goldText}>{sacerdote}</Text>
            </Text>
          )}
        </View>

        <View style={styles.symbolGrid}>
          {symbols.map((s, i) => (
            <Text key={i} style={styles.symbol}>{s}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👑 ALINHAMENTO DE PROSPERIDADE E ARQUÉTIPO</Text>
          <Text style={styles.bodyText}>{reading.prosperidade}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📜 DESCONSTRUÇÃO DA MATRIZ SIMBÓLICA</Text>
          <Text style={styles.bodyText}>{reading.matriz}</Text>
        </View>

        <View style={[styles.section, { borderColor: '#E5C158' }]}>
          <Text style={styles.sectionTitle}>🗝️ O PONTO DE VIRADA</Text>
          <View style={styles.highlight}>
            <Text style={[styles.bodyText, { fontStyle: 'italic' }]}>{reading.pontoDeVirada}</Text>
          </View>
        </View>

        {reading.aprofundamento && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔮 APROFUNDAMENTO CÁRMICO</Text>
            <Text style={styles.bodyText}>{reading.aprofundamento}</Text>
          </View>
        )}

        {reading.rituais && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🕯️ RITUAIS DE ATIVAÇÃO</Text>
            <Text style={styles.bodyText}>{reading.rituais}</Text>
          </View>
        )}

        {reading.datas && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 JANELAS FAVORÁVEIS</Text>
            <Text style={styles.bodyText}>{reading.datas}</Text>
          </View>
        )}

        <View style={{ marginTop: 16, padding: 8, backgroundColor: 'rgba(229,193,88,0.05)', borderRadius: 4 }}>
          <Text style={{ fontSize: 8, color: '#64748b', textAlign: 'center' }}>
            Token de acesso: {tokenAcesso} | Gerado em {new Date().toLocaleDateString('pt-BR')}
          </Text>
        </View>

        <Text style={styles.footer}>
          © {new Date().getFullYear()} Portal Axium — Projeto solo de autoconhecimento e terapias integrativas.
          Este documento é pessoal e intransferível.
        </Text>
      </Page>
    </Document>
  );
}
