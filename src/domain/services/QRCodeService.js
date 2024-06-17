import QRCode from 'qrcode';

class QRCodeService {
  static async generateQR(text) {
    try {
      console.log('Generating QR Code for:', text);
      const response = await QRCode.toDataURL(text);
      console.log('QR Code generated');
      return response;
    } catch (err) {
      console.error('Error generating QR code:', err);
      throw new Error('Error generating QR code');
    }
  }
}

export default QRCodeService;
