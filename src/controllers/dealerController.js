// src/controllers/dealerController.js
const prisma = require('../prismaClient');

const createDealer = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const existing = await prisma.dealer.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Dealer already exists' });

    const dealer = await prisma.dealer.create({
      data: { name, email, phone },
    });
    res.status(201).json(dealer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDealers = async (req, res) => {
  try {
    const dealers = await prisma.dealer.findMany({
      include: { inventory: true },
    });
    res.json(dealers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createDealer, getDealers };
