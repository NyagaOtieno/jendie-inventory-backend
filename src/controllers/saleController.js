const prisma = require('../prismaClient');

const createSale = async (req, res) => {
  try {
    const { inventoryId, buyerType, buyerName, sellingPrice } = req.body;
    // Validate inventory
    const inventory = await prisma.inventory.findUnique({ where: { id: inventoryId }});
    if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
    if (inventory.status === 'Sold') return res.status(400).json({ message: 'Already sold' });
    const sale = await prisma.sale.create({
      data: {
        inventoryId,
        buyerType,
        buyerName,
        sellingPrice
      }
    });
    // update inventory status
    await prisma.inventory.update({ where: { id: inventoryId }, data: { status: 'Sold', sellingPrice }});
    res.status(201).json(sale);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const listSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({ orderBy: { saleDate: 'desc' }, include: { inventory: true }});
    res.json(sales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createSale, listSales };
