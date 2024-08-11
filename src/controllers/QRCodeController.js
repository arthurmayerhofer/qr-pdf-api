import { PDFDocument } from 'pdf-lib';
import QRCode from 'qrcode';

/**
 * Generates a PDF with two QR codes placed side by side.
 *
 * @param {string} text1 - The text for the first QR code.
 * @param {string} text2 - The text for the second QR code.
 * @param {Uint8Array} pdfBuffer - The existing PDF buffer to modify.
 * @returns {Promise<Uint8Array>} The modified PDF bytes.
 */
export const drawPdfQR = async (text1, text2, pdfBuffer) => {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const page = pdfDoc.getPage(0); // Obtém a primeira página do PDF

    // Gera o primeiro QR code
    const qrResponse1 = await QRCode.toDataURL(text1);
    const qrImage1 = await pdfDoc.embedPng(qrResponse1);

    // Gera o segundo QR code
    const qrResponse2 = await QRCode.toDataURL(text2);
    const qrImage2 = await pdfDoc.embedPng(qrResponse2);

    // Define o tamanho do QR code em pixels (2x2 cm ≈ 56.69x56.69 pixels a 72 DPI)
    const qrSize = 56.69;
    const spacing = 10; // Espaçamento entre os QR codes

    const yPosition = 20;

    // Posição x para o primeiro QR code (canto inferior direito)
    const firstQrXPosition = page.getWidth() - qrSize - spacing;

    // Desenha o primeiro QR code
    page.drawImage(qrImage1, {
      x: firstQrXPosition,
      y: yPosition,
      width: qrSize,
      height: qrSize,
    });

    // Posição x para o segundo QR code (à esquerda do primeiro)
    const secondQrXPosition = firstQrXPosition - qrSize - spacing;

    // Desenha o segundo QR code
    page.drawImage(qrImage2, {
      x: secondQrXPosition,
      y: yPosition,
      width: qrSize,
      height: qrSize,
    });
    

    const pdfBytes = await pdfDoc.save();
    return pdfBytes; // Retorna o PDF com os QR Codes inseridos
  } catch (err) {
    console.error('Error creating PDF with QR:', err);
    throw new Error('Error creating PDF with QR');
  }
};
