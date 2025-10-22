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

// -----------------------------
// Dealer CRUD routes
// -----------------------------

// GET all dealers
router.get('/', getDealers);

// GET single dealer by ID
router.get('/:id', getDealerById);

// POST create new dealer
router.post('/', createDealer);

// PUT update dealer by ID
router.put('/:id', updateDealer);

// DELETE dealer by ID
router.delete('/:id', deleteDealer);

export default router;
