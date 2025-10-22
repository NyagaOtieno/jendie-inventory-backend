// src/controllers/dealerController.js
import prisma from '../prismaClient.js';

// Create a new dealer
export const createDealer = async (req, res) => {
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

// Get all dealers
export const getDealers = async (req, res) => {
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

// Get single dealer by ID
export const getDealerById = async (req, res) => {
  try {
    const { id } = req.params;
    const dealer = await prisma.dealer.findUnique({
      where: { id: Number(id) },
      include: { inventory: true },
    });
    if (!dealer) return res.status(404).json({ message: 'Dealer not found' });
    res.json(dealer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update dealer by ID
export const updateDealer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const dealer = await prisma.dealer.update({
      where: { id: Number(id) },
      data: { name, email, phone },
    });

    res.json(dealer);
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Dealer not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete dealer by ID
export const deleteDealer = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.dealer.delete({ where: { id: Number(id) } });
    res.json({ message: 'Dealer deleted successfully' });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Dealer not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
