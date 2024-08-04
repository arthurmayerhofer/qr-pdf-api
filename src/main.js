// src/main.js
import express from 'express';
import cors from 'cors'; // Importar o pacote cors
import multer from 'multer';
import { generateQR } from './interfaces/controllers/QRCodeController.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Obter __dirname em módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Verifica e cria os diretórios necessários se não existirem
const storageDir = path.join(__dirname, 'storage');
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir);
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Função de sanitização de nomes de arquivos
const sanitizeFilename = (filename) => {
  return encodeURIComponent(filename).replace(/%/g, '_');
};

// Configuração do multer para lidar com upload de arquivos
const upload = multer({
  dest: uploadsDir,
  filename: (req, file, cb) => {
    const sanitizedFilename = sanitizeFilename(file.originalname);
    cb(null, sanitizedFilename);
  }
});

// Função para limpar o diretório de uploads
const clearUploads = async () => {
  const files = await fs.promises.readdir(uploadsDir);
  await Promise.all(
    files.map(file => fs.promises.unlink(path.join(uploadsDir, file)))
  );
};

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

    console.log(`Arquivo PDF recebido: ${pdfFile.path}`);

    const modifiedPdfBytes = await generateQR(text, pdfFile.path);

    if (!modifiedPdfBytes) {
      console.error('Erro: Nenhum dado de PDF modificado gerado');
      return res.status(500).json({ error: 'Erro ao gerar o PDF modificado' });
    }

    // Salvar o PDF modificado no diretório storage
    const modifiedPdfPath = path.join(storageDir, `modified_qr_${Date.now()}.pdf`);
    await fs.promises.writeFile(modifiedPdfPath, modifiedPdfBytes);

    console.log(`PDF modificado salvo com sucesso: ${path.basename(modifiedPdfPath)}`);
    console.log(`Local PDF do modificado: ${modifiedPdfPath}`);

    // Enviar o caminho do PDF modificado de volta ao cliente
    res.json({ fileUrl: `http://localhost:3000/storage/${path.basename(modifiedPdfPath)}` });

    // Remover o arquivo PDF original de upload após o processamento
    try {
      await fs.promises.unlink(pdfFile.path);
    } catch (unlinkError) {
      console.error('Erro ao remover o arquivo PDF original:', unlinkError);
    }

    setTimeout(() => {
      clearUploads().catch(console.error);
    }, 1000);
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    res.status(500).json({ error: 'Erro ao gerar QR Code', details: error.message });
  }
});

// Rota para servir arquivos do diretório storage
app.use('/storage', express.static(storageDir));

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.timeout = 60000; // Aumentar o tempo de espera do servidor
