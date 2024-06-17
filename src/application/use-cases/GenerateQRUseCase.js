import QRCodeService from '../../domain/services/QRCodeService.js';
import PDFService from '../../infrastructure/pdf/PDFService.js';

class GenerateQRUseCase {
  static async execute(text) {
    try {
      console.log('Generating QR for text:', text);
      const qrCodeDataUrl = await QRCodeService.generateQR(text);
      console.log('QR Code generated:', qrCodeDataUrl);
      const pdfBytes = await PDFService.createPdfWithQR(qrCodeDataUrl);
      console.log('PDF generated');
      return pdfBytes;
    } catch (err) {
      console.error('Error in GenerateQRUseCase:', err);
      throw err;
    }
  }
}

export default GenerateQRUseCase;
