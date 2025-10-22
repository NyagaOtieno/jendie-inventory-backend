// src/controllers/dealerController.js
import prisma from '../prismaClient.js';

/**
 * GET /api/dealers
 * Fetch all dealers
 */
export const getDealers = async (req, res) => {
  try {
    const dealers = await prisma.dealer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({
      message: '✅ Dealers fetched successfully',
      data: dealers,
    });
  } catch (err) {
    console.error('❌ Error fetching dealers:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * GET /api/dealers/:id
 * Fetch a single dealer by ID
 */
export const getDealerById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'Invalid dealer ID' });

    const dealer = await prisma.dealer.findUnique({ where: { id } });
    if (!dealer) return res.status(404).json({ message: 'Dealer not found' });

    res.status(200).json({
      message: '✅ Dealer fetched successfully',
      data: dealer,
    });
  } catch (err) {
    console.error('❌ Error fetching dealer:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * POST /api/dealers
 * Create a new dealer
 */
export const createDealer = async (req, res) => {
  try {
    const { name, email, phone, price = 0 } = req.body;

    // Validate price
    const floatPrice = parseFloat(price);
    if (isNaN(floatPrice)) return res.status(400).json({ message: 'Price must be a number' });

    const existing = await prisma.dealer.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Dealer already exists' });

    const dealer = await prisma.dealer.create({
      data: { name, email, phone, price: floatPrice },
    });

    res.status(201).json({
      message: '✅ Dealer created successfully',
      data: dealer,
    });
  } catch (err) {
    console.error('❌ Error creating dealer:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * PUT /api/dealers/:id
 * Update an existing dealer
 */
export const updateDealer = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'Invalid dealer ID' });

    let { name, email, phone, price } = req.body;

    // Convert price safely
    if (price !== undefined) {
      price = parseFloat(price);
      if (isNaN(price)) return res.status(400).json({ message: 'Price must be a number' });
    }

    const updated = await prisma.dealer.update({
      where: { id },
      data: { name, email, phone, price },
    });

    res.status(200).json({
      message: '✅ Dealer updated successfully',
      data: updated,
    });
  } catch (err) {
    console.error('❌ Error updating dealer:', err);
    if (err.code === 'P2025') return res.status(404).json({ message: 'Dealer not found' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * DELETE /api/dealers/:id
 * Delete a dealer
 */
export const deleteDealer = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: 'Invalid dealer ID' });

    await prisma.dealer.delete({ where: { id } });

    res.status(200).json({ message: '✅ Dealer deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting dealer:', err);
    if (err.code === 'P2025') return res.status(404).json({ message: 'Dealer not found' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
