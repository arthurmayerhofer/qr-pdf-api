import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { generateQR } from '../src/interfaces/controllers/QRCodeController.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Configuração do multer para lidar com upload de arquivos em memória
// const storage = multer.memoryStorage();
// const upload = multer({ storage });
const storage = multer.memoryStorage();
const upload = multer({ storage });

const port = 3000;

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:3001' // Permitir requisições de http://localhost:3001
}));

// Endpoint para gerar QR Code com PDF
app.post('/api/qrcode', upload.single('pdfFile'), async (req, res) => {
  try {
    const { text } = req.body;
    const pdfFile = req.file;

    if (!pdfFile) {
      return res.status(400).json({ error: 'Nenhum arquivo PDF enviado' });
    }

    console.log(`Arquivo PDF recebido: ${pdfFile.originalname}`);

    // Gerar o QR code e obter o PDF modificado
    const modifiedPdfBytes = await generateQR(text, pdfFile.buffer);

    if (!modifiedPdfBytes) {
      console.error('Erro: Nenhum dado de PDF modificado gerado');
      return res.status(500).json({ error: 'Erro ao gerar o PDF modificado' });
    }

    console.log('PDF modificado gerado com sucesso');

    // Enviar o PDF modificado de volta ao cliente
    res.setHeader('Content-Type', 'application/pdf');
    res.send(modifiedPdfBytes);
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    res.status(500).json({ error: 'Erro ao gerar QR Code', details: error.message });
  }
});

// Inicializar o servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
