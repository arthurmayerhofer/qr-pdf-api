import { Router } from 'express';
import QRCodeController from '../controllers/QRCodeController.js';

const router = Router();

router.post('/generate', QRCodeController.generateQR);

export default router;
