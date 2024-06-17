import GenerateQRUseCase from '../../application/use-cases/GenerateQRUseCase.js';

class QRCodeController {
  static async generateQR(req, res) {
    try {
      console.log('Received request:', req.body);
      const { text } = req.body;
      const pdfBytes = await GenerateQRUseCase.execute(text);
      res.contentType('application/pdf');
      res.send(pdfBytes);
    } catch (err) {
      console.error('Error in generateQR:', err);
      res.status(500).send({ error: 'An error occurred' });
    }
  }
}

export default QRCodeController;
