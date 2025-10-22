// src/routes/dealerRoutes.js
import express from 'express';
import {
  getDealers,
  createDealer,
  getDealerById,
  updateDealer,
  deleteDealer,
} from '../controllers/dealerController.js';

const router = express.Router();

// List all dealers
router.get('/', getDealers);

// Get single dealer by ID
router.get('/:id', getDealerById);

// Create a new dealer
router.post('/', createDealer);

// Update an existing dealer
router.put('/:id', updateDealer);

// Delete a dealer
router.delete('/:id', deleteDealer);

export default router;
