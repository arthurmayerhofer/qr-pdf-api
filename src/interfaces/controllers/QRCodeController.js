import { PDFDocument } from 'pdf-lib';
import QRCode from 'qrcode';

export const generateQR = async (text, pdfBuffer) => {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const page = pdfDoc.getPage(0); // Obtém a primeira página do PDF

    const qrResponse = await QRCode.toDataURL(text);
    const qrImage = await pdfDoc.embedPng(qrResponse);

    // Define o tamanho em pixels (2x2 cm ≈ 56.69x56.69 pixels a 72 DPI)
    const qrSize = 56.69;
    page.drawImage(qrImage, {
      x: page.getWidth() - qrSize - 10, // Posiciona no canto inferior direito com margem
      y: 20,
      width: qrSize,
      height: qrSize,
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes; // Retorna o PDF com o QR Code inserido
  } catch (err) {
    console.error('Error creating PDF with QR:', err);
    throw new Error('Error creating PDF with QR');
  }
};
