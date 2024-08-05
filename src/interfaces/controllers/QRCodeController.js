import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import QRCode from 'qrcode';

export async function generateQR(text, pdfBuffer) {
  try {
    // Carregar o documento PDF a partir do buffer
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Gerar o QR code
    const qrImageDataUrl = await QRCode.toDataURL(text);
    const qrImage = await pdfDoc.embedPng(qrImageDataUrl);

    // Adicionar o QR code à primeira página
    const { width, height } = firstPage.getSize();
    firstPage.drawImage(qrImage, {
      x: width - 100,
      y: height - 100,
      width: 100,
      height: 100
    });

    // Salvar o PDF modificado e retornar os bytes
    const modifiedPdfBytes = await pdfDoc.save();
    return modifiedPdfBytes;
  } catch (error) {
    console.error('Erro na função generateQR:', error);
    throw new Error('Error creating PDF with QR');
  }
}
