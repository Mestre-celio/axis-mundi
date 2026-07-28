import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import { v4 as uuid } from 'uuid';
import { supabaseAdmin } from '../lib/supabase';
import { logger } from '../lib/logger';
import { config } from '../config';

interface OrderData {
  id: string;
  user_id: string;
  amount: number;
  order_items: Array<{
    id: string;
    reading_id: string;
    item_type: string;
  }>;
}

interface DossierOutput {
  filePath: string;
  storageKey: string;
}

export class DossierGenerator {
  async generate(order: OrderData): Promise<DossierOutput> {
    const item = order.order_items[0];
    if (!item?.reading_id) throw new Error('Nenhum item associado ao pedido');

    const { data: reading } = await supabaseAdmin
      .from('readings')
      .select('*, oracles(name, slug), oracle_cards(*)')
      .eq('id', item.reading_id)
      .single();

    if (!reading) throw new Error('Leitura não encontrada');

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', order.user_id)
      .single();

    const docId = uuid();
    const fileName = `dossie-${reading.oracles?.slug || 'axis'}-${docId.slice(0, 8)}.pdf`;
    const tempDir = path.join(process.cwd(), 'tmp');
    const filePath = path.join(tempDir, fileName);

    await fs.mkdir(tempDir, { recursive: true });

    await this.buildPDF({
      filePath,
      reading,
      profile,
      order,
      docId,
    });

    const storageKey = `dossiers/${order.user_id}/${fileName}`;
    const fileBuffer = await fs.readFile(filePath);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(config.supabase.storageBucket)
      .upload(storageKey, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      logger.error({ error: uploadError }, 'Erro ao fazer upload do PDF');
      throw uploadError;
    }

    await fs.unlink(filePath).catch(() => {});

    return { filePath: storageKey, storageKey };
  }

  private async buildPDF(params: {
    filePath: string;
    reading: any;
    profile: any;
    order: OrderData;
    docId: string;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'portrait',
        margins: { top: 40, bottom: 40, left: 50, right: 50 },
        info: {
          Title: `Dossiê Portal Axium - ${params.reading.oracles?.name || 'Oráculo'}`,
          Author: 'Portal Axium',
          Subject: 'Dossiê Astrológico-Arquetípico',
        },
      });

      const stream = createWriteStream(params.filePath);
      doc.pipe(stream);

      // === CAPA ===
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0a0a1a');

      doc.fontSize(42)
        .fillColor('#d4af37')
        .text('PORTAL AXIUM', 0, 120, { align: 'center' });

      doc.fontSize(14)
        .fillColor('#c0c0c0')
        .text('Portal Oracle das Religiões', { align: 'center' });

      doc.moveDown(3);

      doc.fontSize(28)
        .fillColor('#ffffff')
        .text('Dossiê', { align: 'center' });

      doc.fontSize(18)
        .fillColor('#d4af37')
        .text(params.reading.oracles?.name || 'Oráculo', { align: 'center' });

      doc.moveDown(4);

      if (params.profile?.display_name) {
        doc.fontSize(14)
          .fillColor('#c0c0c0')
          .text(`Para: ${params.profile.display_name}`, { align: 'center' });
      }

      doc.fontSize(10)
        .fillColor('#666666')
        .text(new Date().toLocaleDateString('pt-BR'), { align: 'center' });

      doc.addPage();

      // === CONTEÚDO ===
      doc.fontSize(22)
        .fillColor('#0a0a1a')
        .text('Interpretação', { underline: true });

      doc.moveDown(0.5);

      doc.fontSize(11)
        .fillColor('#333333')
        .text(params.reading.ai_interpretation || 'Interpretação sendo processada...', {
          align: 'justify',
          lineGap: 6,
        });

      doc.moveDown(2);

      if (params.reading.poetic_version) {
        doc.fontSize(18)
          .fillColor('#d4af37')
          .text('Versão Poética');

        doc.moveDown(0.5);

        doc.fontSize(11)
          .fillColor('#555555')
          .text(params.reading.poetic_version, {
            align: 'justify',
            lineGap: 4,
          });
      }

      doc.moveDown(2);

      // === RESSONÂNCIA ===
      if (params.reading.resonance_data) {
        doc.fontSize(18)
          .fillColor('#0a0a1a')
          .text('Matriz de Ressonância');

        doc.moveDown(0.5);

        const resonance = params.reading.resonance_data;
        doc.fontSize(11)
          .fillColor('#333333')
          .text(`Harmonia Geral: ${(resonance.overall_harmony * 100).toFixed(0)}%`);
        doc.text(`Padrão Arquetípico: ${resonance.pattern}`);
        doc.text(`Arquétipo Dominante: ${resonance.dominant_archetype}`);
      }

      // === RODAPÉ ===
      doc.fontSize(8)
        .fillColor('#999999')
        .text(
          `Gerado em ${new Date().toLocaleString('pt-BR')} • Portal Axium • ID: ${params.docId.slice(0, 12)}`,
          doc.page.width - 100,
          doc.page.height - 40,
          { align: 'center' }
        );

      doc.end();
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  }
}
