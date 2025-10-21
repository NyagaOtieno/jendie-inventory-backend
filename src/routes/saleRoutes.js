const express = require('express');
const { createSale, getSales } = require('../controllers/saleController');
const router = express.Router();

// Create a sale
router.post('/', createSale);

// Get all sales
router.get('/', getSales);

module.exports = router;
