// src/routes/dealerRoutes.js
import express from 'express';
import {
  getDealers,
  getDealerById,
  createDealer,
  updateDealer,
  deleteDealer,
} from '../controllers/dealerController.js';

const router = express.Router();

router.get('/', getDealers);
router.get('/:id', getDealerById);
router.post('/', createDealer);
router.put('/:id', updateDealer);
router.delete('/:id', deleteDealer);

export default router;
