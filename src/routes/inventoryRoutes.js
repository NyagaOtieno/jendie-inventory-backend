import express from 'express';
import {
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
} from '../controllers/inventoryController.js';

const router = express.Router();

// ✅ Fetch all inventory items
router.get('/', getAllInventory);

// ✅ Fetch a single inventory item by ID
router.get('/:id', getInventoryById);

// ✅ Create a new inventory record
router.post('/', createInventory);

// ✅ Update an inventory record
router.put('/:id', updateInventory);

// ✅ Delete an inventory record
router.delete('/:id', deleteInventory);

export default router;
