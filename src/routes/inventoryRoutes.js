const express = require('express');
const { getInventory, createInventoryItem } = require('../controllers/inventoryController');

const router = express.Router();

router.get('/', getInventory);
router.post('/', createInventoryItem);

module.exports = router;
