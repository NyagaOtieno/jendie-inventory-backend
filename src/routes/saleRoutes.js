const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const { createSale, listSales } = require('../controllers/saleController');

router.post('/', auth, createSale);
router.get('/', auth, listSales);

module.exports = router;
