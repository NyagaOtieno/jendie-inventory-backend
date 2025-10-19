const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const { listDealers, createDealer, updateDealer, getDealer } = require('../controllers/dealerController');

router.get('/', auth, listDealers);
router.get('/:id', auth, getDealer);
router.post('/', auth, createDealer);
router.put('/:id', auth, updateDealer);

module.exports = router;
