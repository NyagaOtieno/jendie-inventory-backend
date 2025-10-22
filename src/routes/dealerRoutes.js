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

// GET all dealers
router.get('/', getDealers);

// GET single dealer by ID
router.get('/:id', getDealerById);

// POST create new dealer
router.post('/', createDealer);

// PUT update dealer
router.put('/:id', updateDealer);

// DELETE dealer
router.delete('/:id', deleteDealer);

export default router;
