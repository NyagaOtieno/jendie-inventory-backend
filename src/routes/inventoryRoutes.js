const express = require('express');
const { getInventory, createInventory } = require('../controllers/inventoryController');
const router = express.Router();

router.get('/', getInventory);
router.post('/', createInventory);

module.exports = router;
