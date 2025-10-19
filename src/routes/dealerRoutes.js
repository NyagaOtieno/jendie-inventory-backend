const express = require('express');
const { getDealers, createDealer } = require('../controllers/dealerController');

const router = express.Router();

router.get('/', getDealers);
router.post('/', createDealer);

module.exports = router;
