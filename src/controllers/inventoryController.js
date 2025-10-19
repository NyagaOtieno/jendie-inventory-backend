const prisma = require('../prismaClient');

const listInventory = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, serial } = req.query;
    const where = {};
    if (status) where.status = status;
    if (serial) where.serialNumber = { contains: serial };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const items = await prisma.inventory.findMany({
      where,
      include: { dealer: true },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });
    const total = await prisma.inventory.count({ where });
    res.json({ data: items, meta: { page: parseInt(page), limit: parseInt(limit), total }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getInventory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.inventory.findUnique({ where: { id }, include: { dealer: true }});
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createInventory = async (req, res) => {
  try {
    const { serialNumber, simCard, model, dealerId, sellingPrice, purchaseDate } = req.body;
    // validate unique serial / sim
    const existsSerial = await prisma.inventory.findUnique({ where: { serialNumber }});
    if (existsSerial) return res.status(400).json({ message: 'Serial number already exists' });
    const existsSim = await prisma.inventory.findUnique({ where: { simCard }});
    if (existsSim) return res.status(400).json({ message: 'SIM card already exists' });
    const data = {
      serialNumber,
      simCard,
      model,
      dealerId: dealerId || null,
      sellingPrice: sellingPrice || null,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : null
    };
    const item = await prisma.inventory.create({ data });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateInventory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { serialNumber, simCard, model, dealerId, sellingPrice, purchaseDate, status } = req.body;
    const item = await prisma.inventory.update({
      where: { id },
      data: {
        serialNumber, simCard, model, dealerId: dealerId || null, sellingPrice: sellingPrice || null, purchaseDate: purchaseDate ? new Date(purchaseDate) : null, status
      }
    });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteInventory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.inventory.delete({ where: { id }});
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { listInventory, getInventory, createInventory, updateInventory, deleteInventory };
