// src/main.js
import express from 'express';
import multer from 'multer';
import { generateQR } from './interfaces/controllers/QRCodeController.js';
import path from 'path';
import fs from 'fs';

const app = express();
const port = 3000;

// Configuração do multer para lidar com upload de arquivos
const upload = multer({ dest: 'uploads/' }); // Define o diretório onde os arquivos serão armazenados temporariamente

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint para gerar QR Code com PDF
app.post('/api/qrcode', upload.single('pdfFile'), async (req, res) => {
  try {
    const { text } = req.body; // Texto para o QR Code (opcional, depende da lógica do seu aplicativo)
    const pdfFile = req.file; // Arquivo PDF enviado pelo cliente

    // Lógica para gerar QR Code usando o arquivo PDF
    const modifiedPdfBytes = await generateQR(text, pdfFile.path);

    // Definir caminho temporário para o PDF modificado
    const modifiedPdfPath = path.join('uploads', 'modified_qr.pdf');
    await fs.promises.writeFile(modifiedPdfPath, modifiedPdfBytes);

    // Enviar o PDF modificado de volta ao cliente
    res.download(modifiedPdfPath, 'modified_qr.pdf', async (err) => {
      if (err) {
        console.error('Erro ao enviar o PDF:', err);
        res.status(500).send('Erro ao enviar o PDF');
      } else {
        // Remove o arquivo PDF modificado após o envio
        //await fs.promises.unlink(modifiedPdfPath);
        // Remove o arquivo PDF original de upload após o processamento
        await fs.promises.unlink(pdfFile.path);
      }
    });
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    res.status(500).json({ error: 'Erro ao gerar QR Code' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
