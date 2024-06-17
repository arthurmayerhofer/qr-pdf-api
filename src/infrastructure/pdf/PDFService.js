import fsPromises from 'fs/promises';
import { PDFDocument } from 'pdf-lib';

class PDFService {
  static async createPdfWithQR(qrCodeDataUrl) {
    try {
      let pdfDoc;
      const filePath = 'qr.pdf';

      try {
        console.log('Reading existing PDF file');
        const existingPdfBytes = await fsPromises.readFile(filePath);
        pdfDoc = await PDFDocument.load(existingPdfBytes);
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log('File not found, creating a new PDF');
          pdfDoc = await PDFDocument.create();
          pdfDoc.addPage();  // Adiciona uma página vazia se o PDF não existir
        } else {
          throw err;
        }
      }

      const pages = pdfDoc.getPages();
      const firstPage = pages[0]; // Obtém a primeira página

      console.log('Embedding QR Code image into PDF');
      const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);

      // Tamanho do QR Code em pontos (2 cm = 56.7 pts)
      const qrSize = 2 * 28.35;
      const { width, height } = firstPage.getSize();

      // Posiciona no canto inferior direito
      const xPosition = width - qrSize - 20; // Ajuste a margem se necessário
      const yPosition = 20; // Ajuste a margem se necessário

      firstPage.drawImage(qrImage, {
        x: xPosition,
        y: yPosition,
        width: qrSize,
        height: qrSize,
      });

      console.log('Saving PDF');
      const pdfBytes = await pdfDoc.save();
      await fsPromises.writeFile(filePath, pdfBytes);

      return pdfBytes;
    } catch (err) {
      console.error('Error in PDFService:', err);
      throw new Error('Error creating PDF with QR');
    }
  }
}

export default PDFService;
