const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const { listInventory, getInventory, createInventory, updateInventory, deleteInventory } = require('../controllers/inventoryController');

router.get('/', auth, listInventory);
router.get('/:id', auth, getInventory);
router.post('/', auth, createInventory);
router.put('/:id', auth, updateInventory);
router.delete('/:id', auth, deleteInventory);

module.exports = router;
