const prisma = require('../prismaClient');

const listDealers = async (req, res) => {
  try {
    const dealers = await prisma.dealer.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(dealers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getDealer = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const dealer = await prisma.dealer.findUnique({ where: { id } });
    if (!dealer) return res.status(404).json({ message: 'Dealer not found' });
    res.json(dealer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createDealer = async (req, res) => {
  try {
    const { name, contact, location, defaultPrice } = req.body;
    const dealer = await prisma.dealer.create({
      data: { name, contact, location, defaultPrice: defaultPrice || null }
    });
    res.status(201).json(dealer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateDealer = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, contact, location, defaultPrice } = req.body;
    const dealer = await prisma.dealer.update({
      where: { id },
      data: { name, contact, location, defaultPrice: defaultPrice || null }
    });
    res.json(dealer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { listDealers, createDealer, updateDealer, getDealer };
