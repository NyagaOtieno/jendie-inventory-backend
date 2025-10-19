// src/controllers/saleController.js
const prisma = require('../prismaClient');

const createSale = async (req, res) => {
  try {
    const { productId, quantity, userId } = req.body;

    // Fetch product to calculate total price
    const product = await prisma.inventory.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (quantity > product.quantity) return res.status(400).json({ message: 'Not enough stock' });

    const totalPrice = product.price * quantity;

    // Update inventory quantity
    await prisma.inventory.update({
      where: { id: productId },
      data: { quantity: product.quantity - quantity },
    });

    const sale = await prisma.sale.create({
      data: { productId, quantity, totalPrice, userId },
    });

    res.status(201).json(sale);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: { product: true, user: true },
    });
    res.json(sales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createSale, getSales };
