import express from 'express';
import cors from 'cors';
import qrCodeRoutes from '../interfaces/routes/QRCodeRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/qrcode', qrCodeRoutes);

export default app;
