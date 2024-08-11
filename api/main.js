import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { drawPdfQR } from "../src/controllers/QRCodeController.js";

const app = express();
const port = 3000;

// Obter __dirname em módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do multer para lidar com upload de arquivos em memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configurar CORS para permitir requisições do frontend
app.use(
  cors({
    origin: "*", // Permitir requisições de qualquer origem
  })
);

// Configurar express para parsear JSON no corpo das requisições
app.use(express.json());

// Endpoint para gerar QR Codes com PDF
app.post("/api/qrcode", upload.single("pdfFile"), async (req, res) => {
  try {
    console.log("Requisição recebida para /api/qrcode");

    const { text1, text2 } = req.body;
    const pdfFile = req.file;

    if (!pdfFile) {
      console.log("Nenhum arquivo PDF enviado");
      return res.status(400).json({ error: "Nenhum arquivo PDF enviado" });
    }

    if (!text1 || !text2) {
      console.log("Texto(s) ausente(s) para geração de QR Code");
      return res.status(400).json({ error: "Texto(s) ausente(s) para geração de QR Code" });
    }

    console.log(`Arquivo PDF recebido: ${pdfFile.originalname}`);
    console.log(`Textos recebidos para QR Codes: '${text1}' e '${text2}'`);

    // Gerar os QR codes e obter o PDF modificado
    const modifiedPdfBytes = await drawPdfQR(text1, text2, pdfFile.buffer);

    if (!modifiedPdfBytes) {
      console.error("Erro: Nenhum dado de PDF modificado gerado");
      return res.status(500).json({ error: "Erro ao gerar o PDF modificado" });
    }

    console.log("PDF modificado gerado com sucesso");

    // Enviar o PDF modificado de volta ao cliente
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=modified_qr.pdf"
    );
    res.send(Buffer.from(modifiedPdfBytes));
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);
    res
      .status(500)
      .json({ error: "Erro ao gerar QR Code", details: error.message });
  }
});

// Inicializar o servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
