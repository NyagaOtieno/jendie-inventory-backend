import express from 'express';
import { createSale, getSales } from '../controllers/saleController.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// ✅ Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/pop'); // folder to store POP files
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});
const upload = multer({ storage });

// Create a sale with optional POP document
router.post('/', upload.single('popDocument'), createSale);

// Get all sales
router.get('/', getSales);

export default router;
